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
  // console.log(workerData);
  console.log(boxData, "box");
  console.log(workerData, "worker");
  
  
  

  const getBoxes = () => {
    fetch("http://45.154.2.116:7010/api/admin/boxes",{
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((item) => setBoxData(item));
  }
  const getWorkers = () => {
    fetch("http://45.154.2.116:7010/api/admin/users?role=WORKER", {
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
    fetch(`http://45.154.2.116:7010/api/admin/boxes/${id}`, {
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
  

  // const editBox = (e) => {
  //   e.preventDefault()
  //   fetch(`http://45.154.2.116:7010/api/admin/boxes/${editBoxId?.id}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-type": "application/json",
  //       "Authorization": `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({
  //       name: boxName,
  //       boxType: boxType,
  //       workerId: +workerId,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((item) => {
  //       getBoxes();
  //       setEditBoxId(null);
  //     });
  // };
  const editBox = (e) => {
    e.preventDefault();
  
    fetch(`http://45.154.2.116:7010/api/admin/boxes/${editBoxId?.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: boxName,
        boxType: boxType,
        workerId: +workerId,
      }),
    })
      .then((res) => res.text())
      .then((text) => {
        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          throw new Error(text); // bu holatda textda xatolik xabari bo'ladi
        }
  
        getBoxes();
        setEditBoxId(null);
      })
      .catch((error) => {
        toast.error(`Xatolik: ${error.message}`);
      });
  };
  

  const createBoxFunc = (e) => {
    e.preventDefault();

    fetch("http://45.154.2.116:7010/api/admin/boxes", {
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
    })
      .then((res) => res.json())
      .then((item) => {
        getBoxes();
        setCreateBox(false);
      });
  };

  useEffect(()=>{
    getBoxes()
  },[])

  useEffect(()=>{
    getWorkers()
  },[editBoxId])

  if (boxData.length === 0) return <h1>Loading...</h1>;
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
                onChange={(e) => setBoxType(e.target.value)}
                style={{ padding: "8px 10px" }}
                className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected>Choose a type</option>
                <option value="INDEPENDENT">INDEPENDENT</option>
                <option value="WORKER">WORKER</option>
              </select>
              {
                boxType === "WORKER" && 
              <div>
                <label
                  style={{ marginBlock: "8px", display: "block" }}
                  htmlFor=""
                >
                  Price
                </label>
                <select
                onChange={(e) => setWorkerId(e.target.value)}
                  style={{ padding: "8px 10px" }}
                  id="countries"
                  className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  {
                    workerData.map((item) => (
                      <option value={item?.id}>{item?.fullName}</option>
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
                  {editBoxId ? "Tarifni o'zgartirish" : "Tarif qo'shish"}
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
            Tarif qo'shish
          </button>
        </div>
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
                    {el?.boxType}
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
      </div>
    </>
  );
};

export default Box;
