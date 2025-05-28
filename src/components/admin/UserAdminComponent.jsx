import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";

const UserAdminComponent = () => {
  const token = localStorage.getItem("token");

  const[ editUserId, setEditUserId] = useState()
  const [createUser, setCreateUser] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      if (editUserId) {
        setFullName(editUserId?.fullName || "");
        setPhoneNumber(editUserId?.phoneNumber || "");
        setPassword(editUserId?.password || "");
      } else {
        setFullName("");
        setPhoneNumber("");
        setPassword("");
      }
    }, [editUserId]);
  

  const getUser = ()=>{
    fetch("https://u-dev.uz/api/admin/users?role=USER", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((item) => {
        setUserData(item)
        setLoading(false)
      });
  }

  const edidUser =()=>{
    
  }
  const createUserItem = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("https://u-dev.uz/api/admin/users?role=USER", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName, phoneNumber, password }),
      });
  
      const text = await response.text();
      if (text) {
        const data = JSON.parse(text); 
        if (!response.ok) {
          throw new Error(data.message || 'Server xatosi');
        }
        getUser();
        toast.success("Ma'lumotlar qo'shildi");
        setCreateUser(false);
      } else {
        if (!response.ok) {
          throw new Error('Serverdan bo‘sh javob olindi');
        }
        getUser();
        toast.success("Ma'lumotlar qo'shildi");
        setCreateUser(false);
      }
  
    } catch (error) {
      toast.error(`Xatolik: ${error.message}`);
    }
  };

  const userDeleteItem = (id) => {
    fetch(`https://u-dev.uz/api/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const text = await res.text();
  
        if (!res.ok) throw new Error(text || "Xatolik yuz berdi");
  
        // agar javob text ko‘rinishida bo‘lsa, log qilamiz
        if (text) {
          console.log("DELETE response text:", text);
          try {
            const data = JSON.parse(text);
          } catch (err) {
            // JSON emasligi mumkin, muammo emas
          }
        }
  
        toast.success("Ma'lumotlar o'chirildi");
        getUser();
      })
      .catch((err) => {
        toast.error("Xatolik: " + err.message);
      });
  };
  
  
  useEffect(()=>{
    getUser()
  },[])

  if (loading) return <h1>Loading...</h1>; 

  return (
    <>
    {
      userData.length===0 ? <h1 className="text-center text-3xl font-bold leading-[75vh] ">Ma'lumotlar mavjud emas</h1> :
      <div
        className="relative flex flex-col w-full h-full text-gray-700 bg-white  bg-clip-border"
        style={{ padding: 0, margin: 0 }}
      >
        {(editUserId || createUser) && (
          <div
            style={{ padding: "20px" }}
            className="fixed w-[100%] z-[50000] bg-[rgba(0,0,0,0.5)] h-[100vh] w-100 top-0 left-0 "
          >
            <form
              onSubmit={editUserId ? edidUser : createUserItem}
              style={{ padding: "20px" }}
              className="max-w-[600px] absolute w-100 bg-white  rounded-xl top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]"
            >
              <label
                style={{ marginBlock: "8px", display: "block" }}
                htmlFor=""
              >
                FullName
              </label>
              <input
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
                type="text"
                placeholder="FullName"
                required
                className="w-full px-3  py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              />
              <label
                style={{ marginBlock: "8px", display: "block" }}
                htmlFor=""
              >
                Phone Number
              </label>
              <input
                onChange={(e) => setPhoneNumber(e.target.value)}
                value={phoneNumber}
                type="text"
                placeholder="Phone Number"
                required
                className="w-full px-3  py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              />
              <label
                style={{ marginBlock: "8px", display: "block" }}
                htmlFor=""
              >
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="text"
                placeholder="Password"
                required
                className="w-full px-3  py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              />
              <div
                style={{
                  marginBlock: "15px",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() => {
                    setEditUserId(false);
                    setCreateUser(false);
                  }}
                  style={{ padding: "10px 20px" }}
                  type="button"
                  className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                >
                  Bekor qilish
                </button>
                <button
                  style={{ padding: "10px 20px" }}
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  {editUserId ? "Saqlash" : "Qo'shish"}
                </button>
              </div>
            </form>
          </div>
        )}
        <div
          className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border"
          style={{
            marginLeft: "1rem",
            marginRight: "1rem",
            marginTop: "1rem",
            marginBottom: 0,
          }}
        >
          <div
            className="flex items-center justify-between gap-8 mb-8"
            style={{ gap: "2rem", marginBottom: "2rem" }}
          >
            <div>
              <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                Foydalanuvchilar
              </h5>
            </div>
            <div
              className="flex flex-col gap-2 shrink-0 sm:flex-row"
              style={{ gap: "0.5rem", flexShrink: 0 }}
            >
            </div>
          </div>
        </div>
        <div
          className="p-6 px-0"
          style={{
            paddingTop: "1.5rem",
            paddingBottom: "1.5rem",
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
          <table className="w-full mt-4 text-left table-auto min-w-max">
            <thead>
              <tr>
                <th
                  className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50"
                  style={{ padding: "1rem" }}
                >
                  <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                    F.I.SH
                  </p>
                </th>
                <th
                  className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50"
                  style={{ padding: "1rem" }}
                >
                  <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                    Telefon
                  </p>
                </th>
                <th
                  className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50"
                  style={{ padding: "1rem" }}
                >
                  <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                    Amallar
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {userData?.map((el, index) => (
                <tr key={index}>
                  <td
                    className="p-4 border-b border-blue-gray-50"
                    style={{ padding: "1rem" }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src="https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg"
                        alt="John Michael"
                        className="relative inline-block h-9 w-9 !rounded-full object-cover object-center"
                      />
                      <div className="flex flex-col">
                        <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                          {el?.fullName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td
                    className="p-4 border-b border-blue-gray-50"
                    style={{ padding: "1rem" }}
                  >
                    <div className="flex flex-col">
                      <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        {el?.phoneNumber}
                      </p>
                      <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 opacity-70">
                        {el?.role}
                      </p>
                    </div>
                  </td>
                  <td
                    className="p-4 border-b border-blue-gray-50"
                    style={{ padding: "1rem" }}
                  >
                    {/* <button
                      onClick={() => setEditUserId(el)}
                      className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                      type="button"
                    >
                      <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                          className="w-4 h-4"
                        >
                          <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
                        </svg>
                      </span>
                    </button> */}
                    <button
                    onClick={()=>userDeleteItem(el?.id)}
                      className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                      type="button"
                    >
                      <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                        <MdDeleteOutline size={20} />
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    }
    </>
  );
};

export default UserAdminComponent;
