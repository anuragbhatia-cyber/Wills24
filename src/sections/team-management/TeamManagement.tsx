import data from '@/../product/sections/team-management/data.json'
import { TeamManagement } from './components/TeamManagement'

export default function TeamManagementPreview() {
  return (
    <TeamManagement
      users={data.users as any}
      lawyers={data.lawyers as any}
      employees={data.employees as any}
      rolePermissions={data.rolePermissions as any}
      onAddUser={() => console.log('Add user')}
      onEditUser={(id) => console.log('Edit user:', id)}
      onToggleUserStatus={(id) => console.log('Toggle user status:', id)}
      onAddLawyer={() => console.log('Add lawyer')}
      onEditLawyer={(id) => console.log('Edit lawyer:', id)}
      onUpdateLawyerAvailability={(id, status) => console.log('Update lawyer availability:', id, status)}
      onViewLawyer={(id) => console.log('View lawyer:', id)}
      onAddEmployee={() => console.log('Add employee')}
      onEditEmployee={(id) => console.log('Edit employee:', id)}
      onToggleEmployeeStatus={(id) => console.log('Toggle employee status:', id)}
      onViewEmployee={(id) => console.log('View employee:', id)}
    />
  )
}
