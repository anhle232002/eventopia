import { useEvent } from "@/hooks/useEvent";
import { useLocations } from "@/hooks/useLocations";
import { useUpdateEvent } from "@/hooks/useUpdateEvent";
import { getDuration } from "@/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { FieldValues, useForm, UseFormRegister } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useDebounce, useOnClickOutside } from "usehooks-ts";

function LocationInput({
  register,
  debouncedValue,
  setLocation,
}: {
  register: UseFormRegister<FieldValues>;
  debouncedValue: string;
  setLocation: (value: string) => void;
}) {
  const { data } = useLocations(debouncedValue);
  const [shouldShowAutoComplete, setShouldShowAutoComplete] = useState(false);
  const ref = useRef(null);
  const handleClickOutside = () => {
    setShouldShowAutoComplete(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  useEffect(() => {
    setShouldShowAutoComplete(true);
  }, [data]);

  return (
    <div ref={ref} className="w-full relative">
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Location</span>
        </label>
        <input
          type="text"
          required
          {...register("location", { required: true })}
          className="input input-bordered input-sm w-full"
        />
      </div>

      {shouldShowAutoComplete && data && data.length > 0 && (
        <ul className="z-[1] menu p-2 shadow bg-base-100 rounded-md w-full absolute">
          {data.slice(0, 5).map((location: any) => (
            <li
              key={location.place_id}
              onClick={() => {
                setLocation(location.display_name);
                setShouldShowAutoComplete(false);
              }}
              className="hover:bg-base-200 py-2"
              role="button"
            >
              {location.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EditEvent() {
  const eventId = useLoaderData();
  const { data: event } = useEvent(Number(eventId));
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setValue("removedImages", [event.images[0].publicId]);
      setSelectedImage(e.target?.result as string);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const {
    register,
    getValues,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { dirtyFields },
  } = useForm({});
  watch("isOnlineEvent");
  watch("location");

  useEffect(() => {
    if (event) {
      const startDate = new Date(event.startDate).toISOString().slice(0, 16);
      reset({ ...event, startDate, images: null });
    }
  }, [event, reset]);

  const debouncedValue = useDebounce<string>(getValues("location"), 3000);
  const updateEventMutation = useUpdateEvent();
  const navigate = useNavigate();

  const onSubmit = async (data: Record<string, any>) => {
    const updatedFields = Object.keys(dirtyFields).reduce((acc, key) => {
      return { ...acc, [key]: data[key] };
    }, {}) as typeof data;

    if (updatedFields.duration) {
      updatedFields.duration = getDuration(data.duration);
    }

    if (updatedFields.startDate) {
      updatedFields.startDate = new Date(data.startDate).getTime().toString();
    }
    if (updatedFields.isOnlineEvent) {
      updatedFields.isOnlineEvent = data.isOnlineEvent ? "1" : "0";
    }

    console.log({
      ...updatedFields,
      eventId: event.id,
      removedImages: data.removedImages || undefined,
      images: data.images || undefined,
    });

    await updateEventMutation.mutateAsync({
      ...updatedFields,
      eventId: event.id,
      removedImages: data.removedImages || undefined,
      images: data.images || undefined,
    });

    navigate("/dashboard");
  };
  return (
    <div className="px-20 py-10">
      <h2 className="text-2xl font-semibold">Edit Event</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 mt-4 rounded-md shadow-md space-y-2"
      >
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Event Title</span>
          </label>
          <input
            type="text"
            required
            {...register("title", { required: true })}
            className="input input-bordered input-sm w-full"
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Short Description</span>
          </label>
          <textarea
            required
            {...register("shortDescription", { required: true })}
            className="textarea textarea-bordered textarea-sm w-full"
          ></textarea>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            required
            {...register("description", { required: true })}
            className="textarea textarea-bordered textarea-sm min-h-[300px] w-full"
          ></textarea>
        </div>

        <div className="grid grid-cols-6 gap-4">
          <div className="form-control w-full flex-[1] col-span-3">
            <label className="label">
              <span className="label-text">Start Date</span>
            </label>
            <input
              type="datetime-local"
              required
              {...register("startDate", { required: true })}
              className="input input-bordered input-sm w-full"
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Day</span>
            </label>
            <input
              type="number"
              required
              min={0}
              defaultValue={0}
              {...register("duration.day", { required: true, min: 0 })}
              className="input input-bordered input-sm w-full"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Hour</span>
            </label>
            <input
              type="number"
              required
              defaultValue={0}
              min={0}
              {...register("duration.hour", { required: true, min: 0 })}
              className="input input-bordered input-sm w-full"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Minute</span>
            </label>
            <input
              type="number"
              required
              min={0}
              defaultValue={0}
              {...register("duration.minute", { required: true, min: 0 })}
              className="input input-bordered input-sm w-full"
            />
          </div>
        </div>

        <div className="flex gap-8">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Total Tickets</span>
            </label>
            <input
              type="number"
              required
              {...register("totalTickets", { required: true, min: 10 })}
              className="input input-bordered input-sm w-full"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Ticket Price</span>
            </label>
            <input
              type="number"
              required
              {...register("ticketPrice", { required: true, min: 1 })}
              className="input input-bordered input-sm w-full"
            />
          </div>
        </div>

        <div className="flex gap-8">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">City</span>
            </label>
            <input
              type="text"
              required
              {...register("city", { required: true })}
              className="input input-bordered input-sm w-full"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Country</span>
            </label>
            <input
              type="text"
              required
              {...register("country", { required: true })}
              className="input input-bordered input-sm w-full"
            />
          </div>
        </div>

        <div className="form-control">
          <label className="label cursor-pointer gap-4 w-36 ">
            <span className="label-text">Online Event</span>
            <input type="checkbox" {...register("isOnlineEvent")} className="checkbox" />
          </label>
        </div>

        <div className="flex gap-8">
          {getValues("isOnlineEvent") ? (
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Online Meeting Url</span>
              </label>
              <input
                type="text"
                {...register("onlineUrl")}
                className="input input-bordered input-sm w-full"
              />
            </div>
          ) : (
            <LocationInput
              setLocation={(value) => setValue("location", value)}
              register={register}
              debouncedValue={debouncedValue}
            />
          )}

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Language</span>
            </label>
            <select
              {...register("language", { required: true })}
              className="select select-sm select-bordered"
            >
              <option selected value="en">
                English
              </option>
              <option value="vi">Vietnamese</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="ru">Russian</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
              <option value="ar">Arabic</option>
              <option value="hi">Hindi</option>
              <option value="bn">Bengali</option>
              <option value="nl">Dutch</option>
              <option value="sv">Swedish</option>
              <option value="da">Danish</option>
              <option value="no">Norwegian</option>
              <option value="fi">Finnish</option>
              <option value="pl">Polish</option>
            </select>
          </div>
        </div>

        <div className="form-control w-full ">
          {event && (
            <div>
              <div className="relative w-[400px] mt-10   shadow-md">
                <img
                  className="w-full h-full  rounded-md object-cover "
                  src={selectedImage || event.images[0].url}
                ></img>
              </div>
            </div>
          )}

          <div>
            <input
              type="file"
              {...register("images")}
              accept="image/*"
              // ref={fileInputRef}
              onChange={handleImageChange}
              className="file-input file-input-sm mt-4 file-input-bordered w-full max-w-xs"
            />
            <button
              onClick={() => {
                setValue("images", null);
                setValue("removedImages", []);
                setSelectedImage(null);
              }}
              className="btn btn-sm ml-3"
            >
              <i className="ri-delete-bin-line"></i>
            </button>
          </div>
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-primary mt-6">
            Edit Event
          </button>
        </div>
      </form>
    </div>
  );
}
export default EditEvent;
