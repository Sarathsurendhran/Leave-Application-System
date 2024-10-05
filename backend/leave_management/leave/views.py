from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import LeaveRequest
from .serializers import LeaveRequestSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from django.views import View

class ApplyLeaveRequestView(generics.CreateAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user
        # Create a new leave request for the employee (user)
        data = request.data.copy()
        data['employee'] = user.id  # Set the employee to the current logged-in user
        
        # Use the serializer to validate and save the data
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response({
            "message": "Leave request submitted successfully.",
            "leave_request": serializer.data
        }, status=status.HTTP_201_CREATED)


class LeaveHistoryView(generics.ListAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print("Fetching leave history for user:", self.request.user)
        # Filter leave requests for the authenticated user
        return self.queryset.filter(employee=self.request.user)


class ManagerLeaveHistoryView(generics.ListAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Assuming the manager can see all leave requests from employees
        return LeaveRequest.objects.all()  # Fetch all leave requests
class LeaveRequestListView(generics.ListAPIView):
    queryset = LeaveRequest.objects.filter(status='pending')
    serializer_class = LeaveRequestSerializer

# Approve a leave request
class ApproveLeaveRequestView(generics.UpdateAPIView):
    queryset = LeaveRequest.objects.filter(status='pending')
    serializer_class = LeaveRequestSerializer

    def patch(self, request, *args, **kwargs):
        leave_request = self.get_object()
        if leave_request.status != 'pending':
            return Response({"error": "Only pending requests can be approved."},
                            status=status.HTTP_400_BAD_REQUEST)

        leave_request.status = 'approved'
        leave_request.save()
        return Response({"message": "Leave request approved"}, status=status.HTTP_200_OK)


# Decline a leave request
class DeclineLeaveRequestView(generics.UpdateAPIView):
    queryset = LeaveRequest.objects.filter(status='pending')
    serializer_class = LeaveRequestSerializer

    def patch(self, request, *args, **kwargs):
        leave_request = self.get_object()
        if leave_request.status != 'pending':
            return Response({"error": "Only pending requests can be declined."},
                            status=status.HTTP_400_BAD_REQUEST)

        leave_request.status = 'rejected'
        leave_request.save()
        return Response({"message": "Leave request declined"}, status=status.HTTP_200_OK)
    



# Manager Leave Report View
@method_decorator(login_required, name='dispatch')
class ManagerLeaveReportView(View):
    def get(self, request):
        if not request.user.is_manager:
            return JsonResponse({'error': 'Permission denied'}, status=403)
        
        leave_requests = LeaveRequest.objects.all()
        report_data = [
            {
                'employee': f"{leave.employee.first_name} {leave.employee.last_name}",
                'leave_type': leave.leave_type,
                'date': leave.date,
                'reason': leave.reason,
                'status': leave.status,
            }
            for leave in leave_requests
        ]
        return JsonResponse({'report': report_data}, safe=False)


@method_decorator(login_required, name='dispatch')
class EmployeeLeaveReportView(View):
    def get(self, request):
        leave_requests = LeaveRequest.objects.filter(employee=request.user)
        report_data = [
            {
                'leave_type': leave.leave_type,
                'date': leave.date,
                'reason': leave.reason,
                'status': leave.status,
            }
            for leave in leave_requests
        ]
        return JsonResponse({'report': report_data}, safe=False)