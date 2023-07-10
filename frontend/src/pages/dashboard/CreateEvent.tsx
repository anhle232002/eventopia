import { CreateEventDto } from "@/api/create-events";
import { useCreateEvent } from "@/hooks/useCreateEvent";
import { useLocations } from "@/hooks/useLocations";
import { getDuration } from "@/utils";
import { useEffect, useState } from "react";
import { FieldValues, useForm, UseFormRegister } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "usehooks-ts";

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
  const [shouldShowAutoComplete, setShouldShowAutoComplete] = useState(true);

  useEffect(() => {
    setShouldShowAutoComplete(true);
  }, [data]);

  return (
    <div className="w-full">
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
        <ul className="z-[1] menu p-2 shadow bg-base-100 rounded-md w-full">
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

function CreateEvent() {
  const {
    register,
    getValues,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  watch("isOnlineEvent");
  watch("location");

  const debouncedValue = useDebounce<string>(getValues("location"), 3000);
  const createEventMutation = useCreateEvent();
  const navigate = useNavigate();
  const onSubmit = async (data: Record<string, any>) => {
    const duration = getDuration(data.duration);
    const startDate = new Date(data.startDate).getTime().toString();
    const isOnlineEvent = data.isOnlineEvent ? "1" : "0";
    console.log(isOnlineEvent);

    await createEventMutation.mutateAsync({
      ...(data as CreateEventDto),
      duration,
      startDate,
      isOnlineEvent,
    });

    navigate("/dashboard");
  };
  return (
    <div className="px-20 py-10">
      <h2 className="text-2xl font-semibold">Create new Event</h2>

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
            className="textarea textarea-bordered textarea-xs w-full"
          ></textarea>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            required
            {...register("description", { required: true })}
            className="textarea textarea-bordered textarea-sm w-full"
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

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Event Banner</span>
          </label>
          <input
            type="file"
            {...register("images", { required: true })}
            accept="image/*"
            className="file-input file-input-sm file-input-bordered w-full max-w-xs"
          />
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-primary mt-6">
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
}
export default CreateEvent;
