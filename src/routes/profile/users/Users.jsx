import { useFetch } from "../../../hooks/useFetch";
import DashboardContent from "../../../components/dashboard-content/DashboardContent";

const Users = () => {
  const [users, loading] = useFetch("/users");
  return (
    <>
      <DashboardContent title={"Products"} data={users} loading={loading}/>
    </>
  )
}

export default Users