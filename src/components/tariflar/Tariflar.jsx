import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";

const Tariflar = () => {
  const token = localStorage.getItem("token");
  const [tariflarData, setTariflarData] = useState([]);
  const [createTarif, setCreateTarif] = useState(false);
  const [editTarifId, setEditTarifId] = useState();  
  const [loading, setLoading] = useState(true);

  // Inputlardan qiymat olish

  const [tarifName, setTarifName] = useState("");
  const [tarifPrice, setTarifPrice] = useState("");
  const [tarifDescription, setTarifDescription] = useState("");

  useEffect(() => {
    if (editTarifId) {
      setTarifName(editTarifId?.name || "");
      setTarifPrice(editTarifId?.price || "");
      setTarifDescription(editTarifId?.description || "");
    } else {
      setTarifName("");
      setTarifPrice("");
      setTarifDescription("");
    }
  }, [editTarifId]);

  const getTariflar = () => {
    fetch("http://45.154.2.116:7010/api/admin/tariffs", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((item) => {
        setTariflarData(item)
        setLoading(false)
      });
  };

  const tarifQoshish = (e) => {
    e.preventDefault();
    fetch("http://45.154.2.116:7010/api/admin/tariffs", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: tarifName,
        price: tarifPrice,
        description: tarifDescription,
        pictures: ["string"],
      }),
    })
      .then((res) => res.json())
      .then((item) => {
        toast.success("Tarif qo'shildi");
        getTariflar();
        setCreateTarif(false);
        setTarifName("");
        setTarifPrice("");
        setTarifDescription("");
      });
  };

  const tarifOchirish = (id) => {
    fetch(`http://45.154.2.116:7010/api/admin/tariffs/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          console.error("Xatolik:", res.status, errText);
          toast.error("Tarif o‘chirilmadi");
          return;
        }

        toast.success("Tarif o‘chirildi");
        getTariflar();
      })
      .catch((err) => {
        console.error("Catch xato:", err);
        toast.error("Tarmoq xatosi!");
      });
  };

  const editTarif = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch(`http://45.154.2.116:7010/api/admin/tariffs/${editTarifId?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: tarifName,
          price: tarifPrice,
          description: tarifDescription,
        }),
      });
  
      if (!res.ok) {
        const errText = await res.text();
        console.error("Xatolik:", res.status, errText);
        toast.error("Tahrirlashda xatolik yuz berdi");
        return;
      }
  
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const item = await res.json();
        console.log("Yangi ma'lumot:", item);
      }
  
      toast.success("Tarif tahrirlandi");
  
      // Bu yerda ro'yxatni to'liq yangilaymiz:
      await getTariflar();
      setEditTarifId(null);
      setCreateTarif(false);
      setTarifName("");
      setTarifPrice("");
      setTarifDescription("");
    } catch (err) {
      console.error("Catch xato:", err);
      toast.error("Tarmoq xatosi!");
    }
  };
  
  

  useEffect(() => {
    getTariflar();
  }, []);

  if(loading) return <h1>Loading...</h1>
  return (
    <>
      <div className=" relative flex flex-col w-full h-full  text-gray-700 bg-white ">
        {(createTarif || editTarifId) && (
          <div
            style={{ padding: "20px" }}
            className="fixed w-[100%] z-[50000] bg-[rgba(0,0,0,0.5)] h-[100vh] w-100 top-0 left-0 "
          >
            <form
              onSubmit={editTarifId ? editTarif : tarifQoshish}
              style={{ padding: "20px" }}
              className="max-w-[600px] absolute w-100 bg-white  rounded-xl top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]"
            >
              <label
                style={{ marginBlock: "8px", display: "block" }}
                htmlFor=""
              >
                Name
              </label>
              <input
                onChange={(e) => setTarifName(e.target.value)}
                value={tarifName}
                type="text"
                placeholder="Name"
                required
                className="w-full px-3  py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              />
              <label
                style={{ marginBlock: "8px", display: "block" }}
                htmlFor=""
              >
                Description
              </label>
              <input
                onChange={(e) => setTarifDescription(e.target.value)}
                value={tarifDescription}
                type="text"
                placeholder="Description"
                required
                className="w-full px-3  py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              />
              <label
                style={{ marginBlock: "8px", display: "block" }}
                htmlFor=""
              >
                Price
              </label>
              <input
                onChange={(e) => setTarifPrice(e.target.value)}
                value={tarifPrice}
                type="number"
                placeholder="price"
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
                    setEditTarifId(false);
                    setCreateTarif(false);
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
                  {editTarifId ? "Tarifni o'zgartirish" : "Tarif qo'shish"}
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="flex justify-end">
          <button
            onClick={() => setCreateTarif(true)}
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
        {
          tariflarData.length == 0 ? <h1 className="text-center text-3xl font-bold leading-[75vh]">Tariflar mavjud emas!!!</h1> :
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Name
                </p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Description
                </p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Price
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
            {tariflarData?.map((el, index) => (
              <tr key={index}>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {el?.name}
                  </p>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {el?.description}
                  </p>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {el?.price}
                  </p>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <CiEdit
                    onClick={() => {
                      setEditTarifId(el);
                    }}
                    style={{ display: "inline-block", cursor: "pointer" }}
                    size={25}
                  />
                  <MdDeleteOutline
                    onClick={() => tarifOchirish(el?.id)}
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

export default Tariflar;
