import AdminNav from "@/components/nav/adminNav"


export default function AdminDashboard({children}){
    return(
        <>
           <AdminNav />
            {children}
        </>
    )
}