import { findTickets, FindTicketsDto } from "@/api/find-tickets";
import { useEvents } from "@/hooks/useEvents";
import { formatDate } from "@/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";

function FindTickets() {
  const [searchInput, setSearchInput] = useState("");
  const { data, refetch } = useEvents({ search: searchInput }, false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const { register, setValue, handleSubmit } = useForm();
  const [tickets, setTickets] = useState<any[] | null>(null);

  const onSubmit = async (data: Record<string, any>) => {
    const tickets = await findTickets(data as FindTicketsDto);

    setTickets(tickets);
    console.log(tickets);
  };

  return (
    <div>
      {(!tickets || tickets.length === 0) && (
        <div className="max-w-2xl mt-10 bg-white p-6 shadow-md rounded-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Find Tickets</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="email" className="block font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email", { required: true })}
                name="email"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="cid" className="block font-semibold mb-2">
                CID
              </label>
              <input
                type="text"
                id="cid"
                {...register("cid", { required: true })}
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="mb-4 ">
              <label htmlFor="eventId" className="block font-semibold mb-2">
                Event
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  id="eventId"
                  name="eventId"
                  onChange={(e) => setSearchInput(e.target.value)}
                  value={searchInput}
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />

                <button
                  type="button"
                  onClick={() => {
                    setSelectedEvent(null);
                    setTickets(null);
                    refetch();
                  }}
                  className="btn btn-primary"
                >
                  <i className="ri-search-line text-xl"></i>
                </button>
              </div>
            </div>

            {!selectedEvent && data && (
              <div>
                <ul className=" space-y-1">
                  {data.events.map((event) => {
                    return (
                      <li
                        onClick={() => {
                          setValue("eventId", event.id);
                          setSelectedEvent(event);
                        }}
                        role="button"
                        className=" px-2 py-1 border rounded-md hover:bg-base-200"
                      >
                        {event.title}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {selectedEvent && (
              <div className="px-2 py-1 bg-primary/80 rounded-md text-white">
                <span>{selectedEvent.title}</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full mt-4">
              Search
            </button>
          </form>

          {tickets && tickets.length === 0 && selectedEvent && (
            <div className="mt-4">
              <p className="text-center text-lg">
                Oops! We did not found any tickets. Please try again, and make sure you provide your
                information accurately
              </p>
            </div>
          )}
        </div>
      )}

      {tickets && tickets.length > 0 && (
        <div className="max-w-3xl mx-auto mt-10">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold mb-4">Ticket List</h2>
            <button onClick={() => setTickets(null)} className="btn btn-primary btn-sm">
              Back
            </button>
          </div>
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="border border-gray-300 rounded-md shadow-md p-4 mb-4 bg-white"
            >
              <h3 className="text-lg font-semibold">{ticket.event.title}</h3>
              <p>
                Event Date: {formatDate(ticket.event.startDate)}
                <br />
                Location: {ticket.event.location}
                <br />
                Ticket Type: {ticket.type}
                <br />
                Status: <span className="capitalize">{ticket.status}</span>
                <br />
                Price: ${ticket.price}
              </p>
              <p>
                Customer: {ticket.customerName}
                <br />
                Bought: {formatDate(ticket.createdAt)}
                <br />
                Email: {ticket.customerEmail}
              </p>
              <div className="text-end">
                <button className="mt-2 btn btn-sm btn-primary">Get ticket</button>
              </div>
              {/* ... other ticket details */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default FindTickets;
