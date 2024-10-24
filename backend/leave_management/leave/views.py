from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import LeaveRequest
from .serializers import LeaveRequestSerializer
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.views import View
from .permissions import IsSuperUser
from rest_framework.exceptions import ValidationError


# API view to apply for a new leave request
# class ApplyLeaveRequestView(generics.CreateAPIView):
#     queryset = LeaveRequest.objects.all()
#     serializer_class = LeaveRequestSerializer
#     permission_classes = [IsAuthenticated]

#     def create(self, request, *args, **kwargs):
#         user = request.user
#         data = request.data.copy()
#         data["employee"] = user.id

#         start_date = data.get("start_date")
#         end_date = data.get("end_date")

#         # Validate start_date and end_date before querying
#         if not start_date or not end_date:
#             return Response(
#                 {"message": "Start date and end date are required."},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         # Check if there are any overlapping leave requests for the same employee
#         overlapping_requests = LeaveRequest.objects.filter(
#             employee=user,
#             status__in=["pending", "approved"],
#             start_date__lt=end_date,
#             end_date__gt=start_date,
#         )

#         if overlapping_requests.exists():
#             return Response(
#                 {
#                     "message": "A leave request already exists for the selected dates.",
#                 },
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         serializer = self.get_serializer(data=data)
#         try:
#             serializer.is_valid(raise_exception=True)
#         except serializers.ValidationError as e:
#             return Response({"errors": e.detail}, status=status.HTTP_400_BAD_REQUEST)

#         self.perform_create(serializer)

#         return Response(
#             {
#                 "message": "Leave request submitted successfully.",
#                 "leave_request": serializer.data,
#             },
#             status=status.HTTP_201_CREATED,
#         )

class ApplyLeaveRequestView(generics.CreateAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user
        data = request.data.copy()
        data["employee"] = user.id

        # Check for overlapping leave requests
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        overlapping_requests = LeaveRequest.objects.filter(
            employee=user,
            status__in=["pending", "approved"],
            start_date__lt=end_date,
            end_date__gt=start_date,
        )

        if overlapping_requests.exists():
            return Response(
                {
                    "message": "A leave request already exists for the selected dates.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Use the serializer to validate and create the leave request
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)  # This will handle missing fields

        self.perform_create(serializer)

        return Response(
            {
                "message": "Leave request submitted successfully.",
                "leave_request": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


# API view to list the leave history for the current user (employee)
class LeaveHistoryView(generics.ListAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]

    # Override the queryset to filter by the current user
    def get_queryset(self):
        return self.queryset.filter(employee=self.request.user)


# API view to list all leave requests for a manager (admin or superuser)
class ManagerLeaveHistoryView(generics.ListAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsSuperUser]

    # Return all leave requests for the manager view
    def get_queryset(self):
        return LeaveRequest.objects.all()


# API view to list all pending leave requests for the manager to review
class LeaveRequestListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsSuperUser]
    queryset = LeaveRequest.objects.filter(status="pending")
    serializer_class = LeaveRequestSerializer


# API view to allow a manager to update the status of a leave request (approve or reject)
class UpdateLeaveRequestStatusView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated, IsSuperUser]
    queryset = LeaveRequest.objects.filter(status="pending")
    serializer_class = LeaveRequestSerializer

    def patch(self, request, *args, **kwargs):
        leave_request = self.get_object()

        # Raise an exception if the leave request is not pending
        if leave_request.status != "pending":
            raise ValidationError("Only pending requests can be updated.")

        # Get the action from the request data (approve or reject)
        action = request.data.get("action")

        # Update the status based on the action
        if action == "approve":
            leave_request.status = "approved"
            message = "Leave request approved"
        elif action == "decline":
            leave_request.status = "rejected"
            message = "Leave request declined"
        else:
            # Raise an exception if the action is invalid
            raise ValidationError(
                "Invalid action provided. Must be 'approve' or 'decline'."
            )

        # Save the updated status to the database
        leave_request.save()

        # Return a success message after updating the leave request
        return Response({"message": message}, status=status.HTTP_200_OK)


# View for generating a leave report for the manager (superuser)
class ManagerLeaveReportView(View):
    permission_classes = [IsAuthenticated, IsSuperUser]

    def get(self, request):
        # Check if the user is a manager
        if not request.user.is_manager:
            return JsonResponse({"error": "Permission denied"}, status=403)

        # Fetch all leave requests for generating the report
        leave_requests = LeaveRequest.objects.all()
        report_data = [
            {
                "employee": f"{leave.employee.first_name} {leave.employee.last_name}",
                "leave_type": leave.leave_type,
                "date": leave.date,
                "reason": leave.reason,
                "status": leave.status,
            }
            for leave in leave_requests
        ]

        # Return the report data as JSON
        return JsonResponse({"report": report_data}, safe=False)


# View for generating a leave report for an individual employee
class EmployeeLeaveReportView(View):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Fetch leave requests for the current user (employee)
        leave_requests = LeaveRequest.objects.filter(employee=request.user)
        report_data = [
            {
                "leave_type": leave.leave_type,
                "date": leave.date,
                "reason": leave.reason,
                "status": leave.status,
            }
            for leave in leave_requests
        ]

        # Return the employee's leave report as JSON
        return JsonResponse({"report": report_data}, safe=False)


# API view to allow an employee to cancel a leave request
class CancelLeaveView(generics.UpdateAPIView):
    queryset = LeaveRequest.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = LeaveRequestSerializer

    def update(self, request, *args, **kwargs):
        # Extract the leave request ID from the request body
        leave_request_id = request.data.get("id")

        try:
            # Get the leave request instance by ID
            leave_request = self.get_queryset().get(id=leave_request_id)

            # Update the status of the leave request to 'cancelled'
            leave_request.status = "cancelled"
            leave_request.save()

            # Serialize the updated leave request and return the response
            serializer = self.get_serializer(leave_request)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except LeaveRequest.DoesNotExist:
            # Return a 404 response if the leave request is not found
            return Response(
                {"detail": "Leave request not found."}, status=status.HTTP_404_NOT_FOUND
            )
