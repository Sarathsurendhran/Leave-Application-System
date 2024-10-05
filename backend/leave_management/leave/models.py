from django.db import models
from accounts.models import User
from django.utils import timezone

class LeaveRequest(models.Model):
    LEAVE_TYPE_CHOICES = [
        ('annual', 'Annual Leave'),
        ('sick', 'Sick Leave'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leave_requests')
    leave_type = models.CharField(max_length=10, choices=LEAVE_TYPE_CHOICES)
    # start_date = models.DateField()
    # end_date = models.DateField()
    date = models.DateField()  # single day for leave
    reason = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    submission_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.employee.first_name} {self.employee.last_name} - {self.leave_type} ({self.status})"
