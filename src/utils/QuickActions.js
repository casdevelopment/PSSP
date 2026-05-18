export const getQuickActions = (role, navigation) => {
    switch (role) {
        case 'coordinator':
            return [
                { title: 'View All Schools', bgColor: '#F0F5FF', textColor: '#2563EB', onPress: () => { } },
                { title: 'Review Expenses', bgColor: '#F0FDF4', textColor: '#059669', onPress: () => { } },
                { title: 'Approve Leaves', bgColor: '#FFF7ED', textColor: '#EA580C', onPress: () => navigation.navigate('LeaveRequests') },
            ];
        case 'staff':
            return [
                { title: 'Mark Attendance', bgColor: '#FDF4FF', textColor: '#8B5CF6', onPress: () => navigation.navigate('Attendance') },
                { title: 'View Students', bgColor: '#F0F5FF', textColor: '#2563EB', onPress: () => { } },
                { title: 'Request Leave', bgColor: '#FFF7ED', textColor: '#EA580C', onPress: () => navigation.navigate('LeaveRequests') },
            ];
        case 'principal':
        default:
            return [
                { title: 'Mark Attendance', bgColor: '#FDF4FF', textColor: '#8B5CF6', onPress: () => navigation.navigate('Attendance') },
                { title: 'Manage Staff', bgColor: '#F0F5FF', textColor: '#2563EB', onPress: () => { } },
                { title: 'Salary Distribution', bgColor: '#F0FDF4', textColor: '#059669', onPress: () => { } },
            ];
    }
};