import { buyTicket, BuyTicketDto } from "@/api/buy-ticket";
import { useEvent } from "@/hooks/useEvent";
import { useLikedEvents } from "@/hooks/useLikedEvents";
import { useLikeEvent } from "@/hooks/useLikeEvent";
import { formatDate, formatDateShort, formatDuration } from "@/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router-dom";

function EventDetail() {
  const id = useLoaderData();
  const { data: event, isLoading } = useEvent(Number(id));
  const { data: likedEvents } = useLikedEvents();
  const isLikedEvent = !!likedEvents && likedEvents.has(event.id);
  const likeEventMutation = useLikeEvent();

  const likeEvent = async () => {
    await likeEventMutation.mutateAsync({ eventId: Number(event.id), like: !isLikedEvent });
  };

  return (
    <div>
      {isLoading && <div>loading...</div>}

      {!isLoading && event && (
        <div className="max-w-6xl m-auto py-8 px-4">
          <div className="h-[450px] relative rounded-xl overflow-hidden">
            <div
              style={{
                backgroundImage: `url('${event.images[0].url || ""}')`,
              }}
              className="absolute inset-0 bg-no-repeat bg-cover blur-[50px]"
            ></div>
            <img
              className="w-full h-full object-contain relative "
              src={event.images[0].url || ""}
              alt=""
            />
          </div>

          <div className="grid md:grid-cols-12 grid-cols-1 gap-8 mt-10">
            <div className="md:col-span-8">
              <span className="font-semibold">{formatDateShort(event.startDate)}</span>

              <h1 className="font-bold text-5xl">{event.title}</h1>

              <p className="text-sm mt-4 font-semibold">{event.shortDescription}</p>

              <div className="mt-8 flex px-5 py-3 bg-zinc-200">
                <div className="flex-1 flex items-center gap-6">
                  <div className="w-14 h-14">
                    <img
                      className="w-full h-full object-cover rounded-full"
                      src={event.organizer.picture}
                      alt=""
                    />
                  </div>

                  <div>
                    <div>
                      By <strong>{event.organizer.name}</strong>
                    </div>
                    <div>{event.organizer._count.followers} followers</div>
                  </div>
                </div>

                <button className="btn btn-primary btn-md capitalize">Follow</button>
              </div>

              <section className="mt-8">
                <h3 className="text-xl font-bold">When and where</h3>

                <div className="mt-4 flex gap-4">
                  <div className="flex gap-4 items-center ">
                    <div>
                      <i className="ri-calendar-line"></i>
                    </div>

                    <div className="space-y-1">
                      <div className="font-bold">Date and time</div>
                      <div className="text-sm">{formatDate(event.startDate)}</div>
                    </div>
                  </div>

                  <div className="divider lg:divider-horizontal"></div>

                  <div className="flex gap-4 items-center">
                    <div>
                      <i className="ri-map-pin-fill"></i>
                    </div>
                    <div className="space-y-1">
                      <div className="font-bold">Location</div>

                      <div className="text-sm">{event.location}</div>

                      <span className="text-sm text-primary">
                        <span> Show map</span>
                        <i className="ri-arrow-down-s-line ml-2"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mt-8">
                <h3 className="text-xl font-bold">Agenda</h3>

                <div className="mt-4 space-y-6">
                  <div className="py-4 px-3  space-y-2 bg-primary/5 ">
                    <div className="relative before:absolute before:h-full before:w-1 before:bg-primary before:top-0 before:left-0 before:rounded-full">
                      <div className="px-6">
                        <p className="text-sm">6:00 PM - 7:00 PM</p>
                        <div className="font-bold">Welcome meeting</div>
                      </div>
                    </div>
                  </div>
                  <div className="py-4 px-3  space-y-2 bg-primary/5 ">
                    <div className="relative before:absolute before:h-full before:w-1 before:bg-primary before:top-0 before:left-0 before:rounded-full">
                      <div className="px-6">
                        <p className="text-sm">6:00 PM - 7:00 PM</p>
                        <div className="font-bold">Welcome meeting</div>
                      </div>
                    </div>
                  </div>{" "}
                  <div className="py-4 px-3  space-y-2 bg-primary/5 ">
                    <div className="relative before:absolute before:h-full before:w-1 before:bg-primary before:top-0 before:left-0 before:rounded-full">
                      <div className="px-6">
                        <p className="text-sm">6:00 PM - 7:00 PM</p>
                        <div className="font-bold">Welcome meeting</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mt-10">
                <h3 className="text-xl font-bold">About this event</h3>

                <div className="mt-4 px-2">
                  <span>
                    <i className="ri-hourglass-fill text-lg text-info"></i>
                  </span>
                  <span className="text-sm font-semibold ml-4">
                    {formatDuration(event.duration)}
                  </span>
                </div>

                <p className="mt-8">{event.description}</p>
              </section>

              <section className="mt-10">
                <h3 className="text-xl font-bold">Tags</h3>

                <div className="mt-4 flex gap-4">
                  <div role="button" className="badge badge-outline">
                    Summer
                  </div>
                  <div role="button" className="badge badge-outline">
                    #workshop
                  </div>
                  <div role="button" className="badge badge-outline">
                    Bol Music Classes
                  </div>
                </div>
              </section>

              <section className="mt-10">
                <h3 className="text-xl font-bold">About the organizer</h3>

                <div className="flex flex-col justify-center items-center mt-4">
                  <div className="w-14 h-14">
                    <img
                      className="w-full h-full object-cover rounded-full"
                      src={event.organizer.picture}
                      alt=""
                    />
                  </div>

                  <div className="mt-4 text-sm">Organized by</div>

                  <div className="mt-4 text-xl font-bold">{event.organizer.name}</div>

                  <div className="text-center mt-6">
                    <div className="font-bold">{event.organizer._count.followers}</div>
                    <div className="text-sm opacity-80">Followers</div>
                  </div>

                  <div className="mt-6 space-x-10">
                    <button className="text-info">Contact</button>

                    <button className="btn btn-info text-white">Follow</button>
                  </div>
                </div>
              </section>
            </div>

            <div className="md:col-span-4 relative ">
              <div className="text-end md:block hidden">
                <button onClick={likeEvent} className="btn btn-circle">
                  {isLikedEvent ? (
                    <i role="button" className="ri-heart-fill text-xl"></i>
                  ) : (
                    <i role="button" className="ri-heart-line text-xl"></i>
                  )}
                </button>
              </div>

              <div className="text-center sticky w-full top-20">
                <div className="py-4 font-bold">From ${event.ticketPrice}</div>

                <button
                  onClick={() => {
                    (window as any).payment_modal.showModal();
                  }}
                  className="w-full bg-primary py-2 px-4 text-white rounded-md"
                >
                  Get tickets
                </button>
              </div>
            </div>
          </div>

          <section className="mt-10">
            <h3 className="text-xl font-bold">Other events you may like</h3>

            <div className="mt-6 grid grid-cols-4">
              {/* <EventCardItem />
            <EventCardItem />
            <EventCardItem />
            <EventCardItem /> */}
            </div>
          </section>
        </div>
      )}

      <dialog id="payment_modal" className="modal ">
        <PaymentForm eventId={event?.id} />
      </dialog>
    </div>
  );
}
export default EventDetail;

export const PaymentForm = ({ eventId }: { eventId: number }) => {
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: Record<string, any>) => {
    setIsLoading(true);

    const responseData = await buyTicket(eventId, data as BuyTicketDto);

    setIsLoading(false);

    window.open(responseData.url);

    (window as any).payment_modal.close();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl w-full bg-white p-6 rounded shadow-md"
    >
      <h3 className="font-bold text-lg">Buy Ticket</h3>
      <div className="p-4 mt-2">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            {...register("customerEmail", { required: true })}
            name="customerEmail"
            className="input input-bordered input-sm w-full"
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Full Name</span>
          </label>
          <input
            {...register("customerName", { required: true })}
            type="text"
            name="customerName"
            className="input input-bordered input-sm w-full"
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">CID/CCCD/ID</span>
          </label>
          <input
            {...register("customerCID", { required: true })}
            type="text"
            name="customerCID"
            className="input input-bordered input-sm w-full"
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Quantity</span>
          </label>
          <input
            type="number"
            min={1}
            {...register("quantity", { required: true, min: 1, valueAsNumber: true })}
            name="quantity"
            defaultValue={1}
            className="input input-bordered input-sm w-full"
          />
        </div>

        <div className="text-end space-x-4">
          <button
            type="button"
            onClick={() => {
              (window as any).payment_modal.close();
            }}
            className="btn btn-outline btn-primary mt-4 btn-sm px-10"
          >
            Close
          </button>
          <button type="submit" className="btn btn-primary mt-4 btn-sm px-10">
            {isLoading && <span className="loading loading-spinner"></span>}
            Pay
          </button>
        </div>
      </div>
    </form>
  );
};
