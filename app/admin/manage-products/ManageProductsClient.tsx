"use client";

import { Product } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatPrice } from "@/utils/formatPrice";
import Heading from "@/app/components/products/Heading";
import Status from "@/app/components/Status";
import {
  MdCached,
  MdClose,
  MdDelete,
  MdDone,
  MdRemoveRedEye,
} from "react-icons/md";
import ActionButton from "@/app/components/ActionButton";
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ManageProductsClientProps {
  products: Product[];
}

const ManageProductsClient = ({ products }: ManageProductsClientProps) => {
  const router = useRouter();

  let rows: any = [];

  if (products) {
    rows = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: formatPrice(product.price),
        category: product.category,
        brand: product.brand,
        inStock: product.inStock,
        images: product.images,
      };
    });
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "name", headerName: "Name", width: 220 },
    {
      field: "price",
      headerName: "Price(EUR)",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="font-bold text-slate-800">{params.row.price}</div>
        );
      },
    },
    { field: "category", headerName: "Category", width: 100 },
    { field: "brand", headerName: "Brand", width: 100 },
    {
      field: "inStock",
      headerName: "In Stock",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="inline-flex w-full">
            {params.row.inStock === true ? (
              <Status
                text="in stock"
                icon={MdDone}
                bg="bg-teal-200"
                color="text-teal-700"
              />
            ) : (
              <Status
                text="out of stock"
                icon={MdClose}
                bg="bg-rose-200"
                color="text-rose-700"
              />
            )}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      align: "center",
      renderCell: (params) => {
        return (
          <div className="flex justify-between items-center gap-2 w-full h-full ">
            <ActionButton
              icon={MdCached}
              onClick={() => {
                handleToggleStock(params.row.id, params.row.inStock);
              }}
            />
            <ActionButton
              icon={MdDelete}
              onClick={() => {
                handleDelete(params.row.id);
              }}
            />
            <ActionButton
              icon={MdRemoveRedEye}
              onClick={() => {
                router.push(`/product/${params.row.id}`);
              }}
            />
          </div>
        );
      },
    },
  ];

  const handleToggleStock = useCallback(
    (id: string, inStock: boolean) => {
      axios
        .put("/api/product", {
          id,
          inStock: !inStock,
        })
        .then((res) => {
          toast.success("Product status changed");
          router.refresh();
        })
        .catch((error) => {
          toast.error("Something went wrong");
          console.log(error);
        });
    },
    [router]
  );

  const handleDelete = useCallback(
    (id: string) => {
      toast("Deleting product, please wait!");

      axios
        .delete(`/api/product/${id}`)
        .then((res) => {
          toast.success("Product deleted successufully");
          router.refresh();
        })
        .catch((error) => {
          toast.error("Error deleting product");
          console.log(error);
        });
    },
    [router]
  );

  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="mb-4 mt-8">
        <Heading title="Manage Products" center />
      </div>

      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};

export default ManageProductsClient;
