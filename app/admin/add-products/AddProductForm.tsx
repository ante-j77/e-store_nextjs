"use client";

import Button from "@/app/components/Button";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import CustomCheckbox from "@/app/components/inputs/CustomCheckbox";
import Input from "@/app/components/inputs/Input";
import SelectColor from "@/app/components/inputs/SelectColor";
import TextArea from "@/app/components/inputs/TextArea";
import Heading from "@/app/components/products/Heading";
import { categories } from "@/utils/Categories";
import { colors } from "@/utils/Colors";
import { uploadFiles } from "@/utils/uploadthing";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export type ImageType = {
  color: string;
  colorCode: string;
  image: File | null;
};

export type UploadedImageType = {
  color: string;
  colorCode: string;
  image: string;
};

const AddProductForm = () => {
  const [isLoading, setLoading] = useState(false);
  const [images, setImages] = useState<ImageType[] | null>();
  const [isProductCreated, setIsProductCreated] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      category: "",
      inStock: false,
      images: [],
      price: "",
    },
  });

  useEffect(() => {
    if (isProductCreated) {
      setImages(null);
      setIsProductCreated(false);
      reset();
    }
  }, [isProductCreated, reset]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);

    let uploadedImages: UploadedImageType[] = [];

    if (!data.category) {
      setLoading(false);
      return toast.error("Category is not selected");
    }

    if (!data.images || data.images.length === 0) {
      setLoading(false);
      return toast.error("No selected image");
    }

    const handleImageUploads = async () => {
      toast("Creating product, please wait...");

      try {
        if (!images || images.length === 0) {
          return toast.error("No images selected");
        }

        const imageFiles = images
          ?.map((img) => img.image)
          .filter((file) => file !== null);

        const uploadedFiles = await uploadFiles("imageUploader", {
          files: imageFiles as File[],
        });

        if (!uploadFiles || uploadedFiles.length === 0) {
          throw new Error("Upload failed");
        }

        uploadedImages = uploadedFiles.map((file, index) => ({
          color: images[index].color,
          colorCode: images[index].colorCode,
          image: file.url,
        }));
      } catch (error) {
        console.error("Upload error:", error);
        setLoading(false);
        toast.error("Failed to upload images");
        return;
      }
    };
    await handleImageUploads();

    const productData = { ...data, images: uploadedImages };

    axios
      .post("/api/product", productData)
      .then(() => {
        toast.success("Product created");
        setIsProductCreated(true);
        router.refresh();
      })
      .catch((error) => {
        toast.error("Something went wrong when saving product to db");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const selectedCategory = watch("category");

  const setCustomValue = useCallback(
    (id: string, value: any) => {
      setValue(id, value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [setValue]
  );

  useEffect(() => {
    setCustomValue("images", images);
  }, [images, setCustomValue]);

  const addImageToState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (!prev) {
        return [value];
      }
      return [...prev, value];
    });
  }, []);

  const removeImageFromState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (prev) {
        const filteredImages = prev.filter(
          (item) => item.color !== value.color
        );

        return filteredImages;
      }
      return prev;
    });
  }, []);

  return (
    <>
      <Heading title="Add a Product" center />
      <Input
        id="name"
        label="name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="price"
        label="price"
        disabled={isLoading}
        register={register}
        errors={errors}
        type="number"
        required
      />
      <Input
        id="brand"
        label="brand"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <TextArea
        id="description"
        label="description"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <CustomCheckbox
        id="inStock"
        register={register}
        label="This Product is in stock"
      />

      <div className="w-full font-medium">
        <div className="mb-2 font-semibold">Select a Category</div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 max-h-[50vh] overflow-y-auto">
          {categories.map((category) => {
            if (category.label === "All") {
              return null;
            }

            return (
              <div key={category.label} className="col-span">
                <CategoryInput
                  onClick={(category) => setCustomValue("category", category)}
                  selected={selectedCategory === category.label}
                  label={category.label}
                  icon={category.icon}
                />
              </div>
            );
          })}
        </div>
      </div>
      {/* SELECTING IMAGES */}
      <div className="w-full flex flex-col flex-wrap gap-4">
        <div>
          <div className="font-bold">
            Select the available product colors and upload their images.
          </div>
          <div className="text-sm">
            You must upload an image for each of the color selected otherwise
            your color selection will be ignored.
          </div>
        </div>
        {/* COLORS */}
        <div className="grid grid-cols-2 gap-3">
          {colors.map((item, index) => {
            return (
              <SelectColor
                key={index}
                item={item}
                addImageToState={addImageToState}
                removeImageFromState={removeImageFromState}
                isProductCreated={isProductCreated}
              />
            );
          })}
        </div>
      </div>
      <Button
        label={isLoading ? "Loading..." : "Add Product"}
        onClick={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default AddProductForm;
