import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";

const Box = () => {
  const token = localStorage.getItem("token");
  const [boxData, setBoxData] = useState([]);
  const [createBox, setCreateBox] = useState(false);
  const [editBoxId, setEditBoxId] = useState();
  const [boxName, setBoxName] = useState("");
  const [boxType, setBoxType] = useState("");
  const [workerId, setWorkerId] = useState("");
  const [workerData, setWorkerData] = useState([]);  
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    if(editBoxId){
      setBoxName(editBoxId?.name || "");
      setBoxType(editBoxId?.boxType || "");
      setWorkerId(editBoxId?.workerId || "");
    }
  },[editBoxId])
  
  

  const getBoxes = () => {
    fetch("https://u-dev.uz/api/admin/boxes",{
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((item) => {
        setBoxData(item)
        setLoading(false)
      });
  }
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
      });
  };

  const boxDelete = (id) => {
    fetch(`https://u-dev.uz/api/admin/boxes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.text())
      .then((text) => {
        try {
          const data = JSON.parse(text); 
          toast.success("O'chirildi");
        } catch (err) {
          toast.success(text || "O'chirildi");
        }
        getBoxes();
        setEditBoxId(null);
      })
      .catch((error) => {
        toast.error(`Xatolik: ${error.message}`);
      });
  };
  


  const editBox = (e) => {
    e.preventDefault();

    fetch(`https://u-dev.uz/api/admin/boxes/${editBoxId?.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: boxName,
        boxType: boxType ,
        workerId: boxType === "INDEPENDENT" ? null : +workerId,
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
    
        getBoxes();
        setEditBoxId(null);
        toast.success("Tahrirlandi");
      })
      .catch((err) => {
        console.error("Xatolik:", err.message);
        toast.error(err.message || "Noma'lum xatolik");
      });
    
  };
  

  // const createBoxFunc = (e) => {
  //   e.preventDefault();

  //   fetch("https://u-dev.uz/api/admin/boxes", {
  //     method: "POST",
  //     headers: {
  //       "Content-type": "application/json",
  //       "Authorization": `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({
  //       name: boxName,
  //       boxType: boxType,
  //       workerId: workerId,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((item) => {
  //       getBoxes();
  //       toast.success("Qo'shildi");
  //       setCreateBox(false);
  //       editBoxId(null);
  //     });
  // };

  const createBoxFunc = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("https://u-dev.uz/api/admin/boxes", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: boxName,
          boxType: boxType,
          workerId: workerId,
        }),
      });
  
      const text = await response.text(); 
  
      if (!response.ok) {
        throw new Error(text || "Xatolik yuz berdi");
      }
  
      if (text) {
        const item = JSON.parse(text);
        toast.success("Qo'shildi");
        getBoxes();
        setCreateBox(false);
      } else {
        toast.success("Qo'shildi (javobsiz)");
        getBoxes();
        setCreateBox(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Xatolik: " + error.message);
    }
  };
  
  
  useEffect(()=>{
    getBoxes()
  },[])

  useEffect(()=>{
    getWorkers()
  },[editBoxId])

  if (loading) return <h1>Loading...</h1>;
  return (
    <>
      <div className=" relative flex flex-col w-full h-full  text-gray-700 bg-white ">
        {(createBox || editBoxId) && (
          <div
            style={{ padding: "20px" }}
            className="fixed w-[100%] z-[50000] bg-[rgba(0,0,0,0.5)] h-[100vh] w-100 top-0 left-0 "
          >
            <form
              onSubmit={editBoxId ? editBox : createBoxFunc}
              style={{ padding: "20px" }}
              className="max-w-[600px] absolute w-100 bg-white  rounded-xl top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]"
            >
              <label
                style={{ marginBlock: "8px", display: "block" }}
                htmlFor=""
              >
                Box Name
              </label>
              <input
                onChange={(e) => setBoxName(e.target.value)}
                value={boxName}
                type="text"
                placeholder="Box Name"
                required
                className="w-full px-3  py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              />
              <label
                style={{ marginBlock: "8px", display: "block" }}
                htmlFor=""
              >
                boxType
              </label>
              <select
                value={boxType}
                onChange={(e) => setBoxType(e.target.value)}
                style={{ padding: "8px 10px" }}
                className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="INDEPENDENT">Sammoy</option>
                <option value="WORKER">Ishchi yuvadi</option>
              </select>
              {
                boxType === "WORKER" && 
              <div>
                <label
                  style={{ marginBlock: "8px", display: "block" }}
                  htmlFor=""
                >
                  Ishchilar
                </label>
                <select
                value={workerId}
                onChange={(e) => setWorkerId(e.target.value)}
                  style={{ padding: "8px 10px" }}
                  id="countries"
                  className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  {
                    workerData.map((item,index) => (
                      <option key={index} value={item?.id}>{item?.fullName}</option>
                    ))
                  }
                
                </select>
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
                    setEditBoxId(false);
                    setCreateBox(false);
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
                  {editBoxId ? "Box nomini o'zgartirish" : "Box qo'shish"}
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="flex justify-end">
          <button
            onClick={() => setCreateBox(true)}
            type="button"
            style={{
              paddingInline: "20px",
              paddingBlock: "10px",
              marginBlock: "10px",
            }}
            className="px-5 py-2.5 cursor-pointer me-2 mb-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Box qo'shish
          </button>
        </div>
        {
          boxData.length==0 ? <h1 className="text-center text-3xl font-bold leading-[75vh]"> Ma'lumotlar mavjud emas!!!</h1>:
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Box Name
                </p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Worker Name
                </p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Box Type
                </p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Amallar
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            {boxData?.map((el, index) => (
              <tr key={index}>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {el?.name}
                  </p>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {el?.workerFullName}
                  </p>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {el?.boxType ==="WORKER"?"Ishchi yuvadi":"Sammoy"}
                  </p>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <CiEdit
                    onClick={() => {
                      setEditBoxId(el);
                    }}
                    style={{ display: "inline-block", cursor: "pointer" }}
                    size={25}
                  />
                  <MdDeleteOutline
                    onClick={() => boxDelete(el?.id)}
                    style={{
                      display: "inline-block",
                      cursor: "pointer",
                      marginLeft: "10px",
                    }}
                    size={25}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        }
      </div>
    </>
  );
};

export default Box;
