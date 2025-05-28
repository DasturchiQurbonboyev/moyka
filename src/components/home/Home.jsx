import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";

const Home = () => {
  const token = localStorage.getItem("token");

  const [workerData, setWorkerData] = useState([]);
  const [editWorkerId, setEditWorkerId] = useState(null);
  const [createWorker, setCreateWorker] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  

    useEffect(() => {
      if (editWorkerId) {
        setFullName(editWorkerId?.fullName || "");
        setPhoneNumber(editWorkerId?.phoneNumber || "");
        setPassword(editWorkerId?.password || "");
      } else {
        setFullName("");
        setPhoneNumber("");
        setPassword("");
      }
    }, [editWorkerId]);
  
  const getWorkers = () => {
    fetch("https://u-dev.uz/api/admin/users?role=WORKER", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((item) => {
        setWorkerData(item);
        setLoading(false);
      });
  };

  const createWorkerItem = (e) => {
    e.preventDefault();
  
    fetch("https://u-dev.uz/api/admin/users?role=WORKER", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName,
        phoneNumber,
        password,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw { message: errorText };
        }
        try {
          return await res.json();
        } catch {
          return null;
        }
      })
      .then((item) => {
        toast.success("Ma'lumotlar qo'shildi");
        getWorkers();
        setCreateWorker(false);
      })
      .catch((error) => {
        console.error("Xatolik yuz berdi:", error);
        toast.error("Ma'lumot qo'shishda xatolik yuz berdi: " + (error.message || "Noma'lum xato"));
      });
  };
  

  const editWorker = (e) => {
    e.preventDefault();
  
    fetch(`https://u-dev.uz/api/admin/users/${editWorkerId?.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName,
        phoneNumber,
      }),
    })
      .then(async (res) => {
        const contentLength = res.headers.get("content-length");
        let data = null;
  
        if (contentLength && +contentLength > 0) {
          data = await res.json();
        }
  
        if (!res.ok || data?.error) {
          throw new Error(data?.error || "Xatolik yuz berdi");
        }
  
        toast.success("Ma'lumotlar tahrirlandi");
        getWorkers();
        setEditWorkerId(null);
        setFullName("");
        setPhoneNumber("");
        setPassword("");
      })
      .catch((err) => {
        console.error("Edit xatosi:", err.message);
        toast.error(err.message || "Noma'lum xatolik");
      });
  };
  
  const delWorkerItem = async (id) => {
    try {
      const response = await fetch(`https://u-dev.uz/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      const text = await response.text();
  
      if (!response.ok) {
        throw new Error(text || 'Noma\'lum xatolik yuz berdi');
      }
        if (text) {
        const data = JSON.parse(text);
        toast.success("Foydalanuvchi o'chirildi");
        getWorkers()
      } else {
        toast.success("Foydalanuvchi o'chirildi");
        getWorkers()
      }
    } catch (error) {
      toast.error(`Xatolik: ${error.message}`);
    }
  };
  

  useEffect(() => {
    getWorkers();
  }, []);

  if (loading) return <h1>Loading...</h1>;
  return (
    <>
      <div
        className="relative flex flex-col w-full h-full text-gray-700 bg-white  bg-clip-border"
        style={{ padding: 0, margin: 0 }}
      >
        {(editWorkerId || createWorker) && (
          <div
            style={{ padding: "20px" }}
            className="fixed w-[100%] z-[50000] bg-[rgba(0,0,0,0.5)] h-[100vh] w-100 top-0 left-0 "
          >
            <form
              onSubmit={editWorkerId ? editWorker : createWorkerItem}
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
                defaultValue={editWorkerId ? editWorkerId?.fullName : ""}
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
                defaultValue={editWorkerId ? editWorkerId?.phoneNumber : ""}
                type="text"
                placeholder="Phone Number"
                required
                className="w-full px-3  py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              />
              {
                !editWorkerId && 
                <div>

                  <label
                    style={{ marginBlock: "8px", display: "block" }}
                    htmlFor=""
                  >
                    Password
                  </label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    defaultValue={editWorkerId ? editWorkerId?.password : ""}
                    type="text"
                    placeholder="Password"
                    required
                    className="w-full px-3  py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  />
                </div>
              }
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
                    setEditWorkerId(false);
                    setCreateWorker(false);
                  }}
                  style={{ padding: "10px 20px" }}
                  type="button"
                  class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                >
                  Bekor qilish
                </button>
                <button
                  style={{ padding: "10px 20px" }}
                  type="submit"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  {editWorkerId ? "Saqlash" : "Qo'shish"}
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
                Ishchilar
              </h5>
            </div>
            <div
              className="flex flex-col gap-2 shrink-0 sm:flex-row"
              style={{ gap: "0.5rem", flexShrink: 0 }}
            >
              <button
                onClick={()=>setCreateWorker(true)}
                className="flex select-none items-center gap-3 rounded-lg bg-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                style={{
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  strokeWidth="2"
                  className="w-4 h-4"
                >
                  <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"></path>
                </svg>
                Ishchi qo'shish
              </button>
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
          {
            workerData.length===0 ? <h1 className="text-center text-3xl font-bold">Ishchilar mavjud emas</h1> : 
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
              {workerData?.map((el, index) => (
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
                    <button
                      onClick={() => setEditWorkerId(el)}
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
                    </button>
                    <button
                      onClick={() => delWorkerItem(el?.id)}
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
          }
        </div>
      </div>
    </>
  );
};

export default Home;
