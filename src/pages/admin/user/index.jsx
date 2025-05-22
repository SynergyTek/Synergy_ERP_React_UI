
import { useReducer, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import { Button, Notification } from "@/components/";
import Table from "@/components/core/Table";

import Modal from "~/core/AlertModal";
import { toast } from "sonner";

const initialState = {
  userId: null,
  isModalOpen: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER_ID':
      return { ...state, userId: action.payload };
    case 'OPEN_MODAL':
      return { ...state, isModalOpen: true };
    case 'CLOSE_MODAL':
      return { ...state, isModalOpen: false, userId: null };
    default:
      return state;
  }
};

const User = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleConfirm = async () => {
    console.log(state.userId, "to be deleted id");
    try {
      const url = `/dmsapi/PortalAdmin/User/DeleteUser?Id=${state.userId}`
      console.log(url, "delete api")
      const response = await axios.get(`/dmsapi/PortalAdmin/User/DeleteUser?Id=${state.userId}`);
      console.log(response.data, " delete api user res")
      response.data?.success ?
        toast.success("Successful !", {
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">Your password has been changed!</code>
            </pre>
          ),
        })
        :
        console.log("Something went wrong!")
    } catch (error) {
      console.error('Error posting data:', error);
      toast.error("Warning !", {
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">Something went wrong!</code>
          </pre>
        ),
      });

    }

    dispatch({ type: 'CLOSE_MODAL' });
  };

  const handleCancel = () => {

    dispatch({ type: 'CLOSE_MODAL' });
  };

  const edit = (id, name) => {
    console.log(id, name, " from context")
    router.push(
      {
        pathname: "/admin/user/manage",
        query: { id, name },
      },
      "/admin/user/manage"
    );
  };

  const ChangePassword = (id, name) => {
    console.log(id, name, " from context")
    router.push(
      {
        pathname: "/admin/user/change-password",
        query: { id, name },
      },
      "/admin/user/change-password"
    );
  };

  return (
    <div  >
      <Head>
        <title>User</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {state.isModalOpen && (
        <Modal
          message="Are you sure you want to proceed?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          confirmText="Yes"
          cancelText="No"
        />
      )}

      <h2 className={"text-2xl mb-4 font-semibold text-primary-900 dark:text-primary-300 px-7"}>
        EMPLOYEES
      </h2>
      <div className="px-7">
           <Button className="mb-3 "
        onClick={() => {
          router.push("/admin/user/manage")
        }}
        primary
        text="Create New Employee"
      />

      </div>

   

     <Table 
                columnDefs={[
                {
                  field: "Name"
                  
                },
                {
                  field: "Email"
                  
                },
                {
                  field: "JobTitle"
                  
                },
                {
                  field: "DepartmentName"
                
                },
                {
                  field: "Status"
                  
                },
               
              ]}
                source={`/portalAdmin/User/ReadData?userId=45bba746-3309-49b7-9c03-b5793369d73c&portalName=DMS`}
                 actions={[
                    {
                      icon: "edit",
                      label: "Edit",
                      onClick: (rowData) => {
                        console.log("Edit:", rowData);
                      }
                    },
                    {
                      icon: "trash",
                      label: "Delete",
                      onClick: (rowData) => {
                        console.log("Delete:", rowData);
                      }
                    }
                  ]}
                   
                />
    </div>
  )
}

export default User;
