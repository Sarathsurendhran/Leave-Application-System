from rest_framework import serializers
from .models import LeaveRequest
from accounts.models import User


class LeaveRequestSerializer(serializers.ModelSerializer):
    # employee = UserSerializer(read_only=True)  # Include employee details
    # employee = serializers.PrimaryKeyRelatedField(queryset=User.objects.all()) 
    employee_name = serializers.SerializerMethodField(read_only=True) 
    class Meta:
        model = LeaveRequest
        fields = ['id','employee','employee_name', 'leave_type', 'date', 'reason', 'status', 'submission_date']
    def get_employee_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"

