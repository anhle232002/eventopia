import EventCardItem from "@/components/event/EventCardItem";
import { useEvents } from "@/hooks/useEvents";
import { useUser } from "@/libs/auth";
import { useState } from "react";
import { Link } from "react-router-dom";

function Events() {
  const { data: user } = useUser();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useEvents({ organizer: user?.organizer.id, page });
  return (
    <div className="px-20 py-10">
      <h1 className="text-3xl font-semibold">Your Events</h1>

      {!isLoading && data?.events && (
        <div className="mt-10">
          {data.events.length > 0 ? (
            <div>
              <div className="flex flex-wrap gap-6 min-h-[70vh] bg-white shadow-md p-4">
                {data.events.map((event) => {
                  return (
                    <Link to={`/dashboard/events/edit/${event.slug}`} key={event.id}>
                      <EventCardItem event={event} />
                    </Link>
                  );
                })}
              </div>

              <div className="flex justify-center mt-8">
                <div className="join">
                  <button
                    onClick={() => {
                      if (page <= 1) return;
                      setPage(page - 1);
                    }}
                    className="join-item btn btn-sm"
                  >
                    «
                  </button>
                  <button className="join-item btn btn-sm">Page {page}</button>
                  <button
                    onClick={() => {
                      if (page >= Math.ceil(data.total / 10)) return;
                      setPage(page + 1);
                    }}
                    className="join-item btn btn-sm"
                  >
                    »
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>There are no events</div>
          )}
        </div>
      )}
      <div></div>
    </div>
  );
}

export default Events;
