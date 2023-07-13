import { formatDate } from "@/utils";

function EventCardItem({ event }: { event: any }) {
  return (
    <div
      role="button"
      className="w-[250px] duration-200 hover:shadow-[0px_2px_20px_5px_rgba(0,0,0,0.2)]"
    >
      <div>
        <img className="w-full h-56" src={event.images[0]?.url || ""} alt="" />
      </div>

      <div className="mt-4 px-2 pb-8">
        <h3 className="font-bold">{event.title}</h3>

        <p className="text-sm text-primary mt-3">{formatDate(event.startDate)}</p>

        <div className="text-sm opacity-80 mt-3">Starts at ${event.ticketPrice}</div>

        <div className="font-semibold text-sm mt-1">{event.location}</div>

        <div className="text-sm mt-1">
          <span>
            <i className="ri-user-line"></i>
          </span>
          <span className="ml-2">11 followers</span>
        </div>
      </div>
    </div>
  );
}
export default EventCardItem;
