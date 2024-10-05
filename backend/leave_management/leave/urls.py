from django.urls import path
from .views import  *

urlpatterns = [
    path('apply/', ApplyLeaveRequestView.as_view(), name='apply-leave'),
    path('history/', LeaveHistoryView.as_view(), name='leave-history'),  # New path for history
    path('requests/', LeaveRequestListView.as_view(), name='leave-requests'),
    path('requests/<int:pk>/approve/', ApproveLeaveRequestView.as_view(), name='approve-leave'),
    path('requests/<int:pk>/decline/', DeclineLeaveRequestView.as_view(), name='decline-leave'),
    path('manager-history/', ManagerLeaveHistoryView.as_view(), name='leave_history'),
    path('employee/report/', EmployeeLeaveReportView.as_view(), name='employee-leave-report'),
    path('manager/report/', ManagerLeaveReportView.as_view(), name='manager-leave-report'),

]
