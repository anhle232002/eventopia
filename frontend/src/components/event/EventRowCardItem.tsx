import { formatDate } from "@/utils";

function EventRowCardItem({ event }: { event: any }) {
  return (
    <div>
      <div
        role="button"
        className="grid grid-cols-12 gap-8  hover:shadow-[0px_2px_20px_5px_rgba(0,0,0,0.2)] p-4 rounded-md duration-300"
      >
        <div className="col-span-4">
          <img className="rounded-md h-[150px] w-full" src={event.images[0].url} alt="" />
        </div>

        <div className="col-span-8 space-y-2">
          <h2 className="font-semibold">{event.title}</h2>

          <div className="text-sm">{formatDate(event.startDate)}</div>

          <div className="text-sm opacity-80">{event.location}</div>

          {event.isOnlineEvent ? <div>Online</div> : <div>Offline</div>}
        </div>
      </div>
    </div>
  );
}
export default EventRowCardItem;
