import EventRowCardItem from "@/components/event/EventRowCardItem";

function SearchEvents() {
  return (
    <div className="max-w-7xl m-auto py-10">
      <div className="">
        <div className="flex items-center gap-4 px-4 py-3 bg-[#fafafa] rounded shadow-md">
          <input type="text" className="text-sm w-full outline-none bg-transparent" />

          <button className="btn btn-sm btn-outline">
            <i className="ri-search-line"></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12 mt-8 items-start">
        <div className="col-span-4 bg-white p-4 rounded-md shadow-md">
          <h3 className="font-semibold text-lg">Filters</h3>
          <div className="mt-8">
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Only show events from organizers I follow</span>
                <input type="checkbox" className="checkbox" />
              </label>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Online events only</span>
                <input type="checkbox" className="checkbox" />
              </label>
            </div>
          </div>

          <div className="mt-8">
            <div>Date</div>
            <div className="form-control">
              <label className="label space-x-4 cursor-pointer justify-start">
                <input
                  type="radio"
                  name="date"
                  className="radio radio-sm checked:bg-blue-500"
                  checked
                />
                <span className="label-text">Today</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label space-x-4 cursor-pointer justify-start">
                <input
                  type="radio"
                  name="date"
                  className="radio radio-sm checked:bg-blue-500"
                  checked
                />
                <span className="label-text">This week</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label space-x-4 cursor-pointer justify-start">
                <input
                  type="radio"
                  name="date"
                  className="radio radio-sm checked:bg-blue-500"
                  checked
                />
                <span className="label-text">This month</span>
              </label>
            </div>
          </div>

          <div className="mt-4">
            <div>Language</div>

            <div className="form-control">
              <label className="label space-x-4 cursor-pointer justify-start">
                <input
                  type="radio"
                  name="language"
                  className="radio radio-sm checked:bg-blue-500"
                  checked
                />
                <span className="label-text">English</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label space-x-4 cursor-pointer justify-start">
                <input
                  type="radio"
                  name="language"
                  className="radio radio-sm checked:bg-blue-500"
                  checked
                />
                <span className="label-text">Vietnamese</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label space-x-4 cursor-pointer justify-start">
                <input
                  type="radio"
                  name="language"
                  className="radio radio-sm checked:bg-blue-500"
                  checked
                />
                <span className="label-text">French</span>
              </label>
            </div>
          </div>
        </div>

        <div className="col-span-8">
          <div className="space-y-10">
            <EventRowCardItem />
            <EventRowCardItem />
            <EventRowCardItem />
            <EventRowCardItem />
            <EventRowCardItem />
            <EventRowCardItem />
            <EventRowCardItem />
          </div>

          <div className="flex justify-center mt-8">
            <div className="join">
              <button className="join-item btn btn-sm">«</button>
              <button className="join-item btn btn-sm">Page 1</button>
              <button className="join-item btn btn-sm">»</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SearchEvents;
