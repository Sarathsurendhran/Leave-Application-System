from rest_framework import serializers
from .models import LeaveRequest
from accounts.models import User



# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         # fields = ['first_name', 'last_name']
#         fields = '__all__'



class LeaveRequestSerializer(serializers.ModelSerializer):
    # employee = UserSerializer(read_only=True)  # Include employee details
    # employee = serializers.PrimaryKeyRelatedField(queryset=User.objects.all()) 
    employee_name = serializers.SerializerMethodField(read_only=True) 
    class Meta:
        model = LeaveRequest
        # fields = '__all__'
        fields = ['id','employee','employee_name', 'leave_type', 'date', 'reason', 'status', 'submission_date']
        # fields = ['employee', 'leave_type','date', 'reason','status', 'submission_date','employee_name']
    def get_employee_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"

