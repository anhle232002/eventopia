import EventRowCardItem from "@/components/event/EventRowCardItem";
import { useCategories } from "@/hooks/useCategories";
import { useEvents } from "@/hooks/useEvents";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

function SearchEvents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [params, setParams] = useSearchParams();
  const { data, isLoading } = useEvents({
    page: params.get("page") ? Number(params.get("page")) : 1,
    online: params.get("online") ? 1 : undefined,
    date: params.get("date") || undefined,
    status: params.get("status") || undefined,
    search: params.get("q") || undefined,
    category: Number(params.get("category")) || undefined,
  });

  const { data: categories, isLoading: isCategoriesLoading } = useCategories({ order: "" });
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const setDateQuery = (value: string) => {
    setParams((params) => {
      if (value) {
        params.set("date", value);
      } else {
        params.delete("date");
      }

      return params;
    });
  };

  const setLanguageQuery = (value: string) => {
    setParams((params) => {
      if (value) {
        params.set("language", value);
      } else {
        params.delete("language");
      }

      return params;
    });
  };

  return (
    <div className="max-w-7xl m-auto py-10 px-4">
      <div className="">
        <div className="flex items-center gap-4 px-4 py-3 bg-[#fafafa] rounded shadow-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm w-full outline-none bg-transparent"
          />

          <button
            onClick={() =>
              setParams((params) => {
                if (searchTerm === "") {
                  params.delete("q");
                }
                params.set("q", searchTerm);
                return params;
              })
            }
            className="btn btn-sm btn-outline"
          >
            <i className="ri-search-line"></i>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-12 grid-cols-1 gap-12 mt-8 items-start">
        <div className="md:col-span-4 col-span-1 bg-white p-4 rounded-md shadow-md">
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
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setParams((params) => {
                      if (e.target.checked) {
                        params.append("online", "1");
                      } else {
                        params.delete("online");
                      }
                      return params;
                    });
                  }}
                  className="checkbox"
                />
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
                  checked={!params.get("date")}
                  onChange={(e) => setDateQuery(e.target.value)}
                  value={""}
                  className="radio radio-sm checked:bg-blue-500"
                />
                <span className="label-text">All</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label space-x-4 cursor-pointer justify-start">
                <input
                  checked={params.get("date") === "today"}
                  onChange={(e) => setDateQuery(e.target.value)}
                  value={"today"}
                  type="radio"
                  name="date"
                  className="radio radio-sm checked:bg-blue-500"
                />
                <span className="label-text">Today</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label space-x-4 cursor-pointer justify-start">
                <input
                  checked={params.get("date") === "this_week"}
                  onChange={(e) => setDateQuery(e.target.value)}
                  value={"this_week"}
                  type="radio"
                  name="date"
                  className="radio radio-sm checked:bg-blue-500"
                />
                <span className="label-text">This week</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label space-x-4 cursor-pointer justify-start">
                <input
                  checked={params.get("date") === "this_month"}
                  onChange={(e) => setDateQuery(e.target.value)}
                  value={"this_month"}
                  type="radio"
                  name="date"
                  className="radio radio-sm checked:bg-blue-500"
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
                  checked={!params.get("language")}
                  onChange={(e) => setLanguageQuery(e.target.value)}
                  value={""}
                  type="radio"
                  name="language"
                  className="radio radio-sm checked:bg-blue-500"
                />
                <span className="label-text">All</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label space-x-4 cursor-pointer justify-start">
                <input
                  checked={params.get("language") === "en"}
                  onChange={(e) => setLanguageQuery(e.target.value)}
                  value={"en"}
                  type="radio"
                  name="language"
                  className="radio radio-sm checked:bg-blue-500"
                />
                <span className="label-text">English</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label space-x-4 cursor-pointer justify-start">
                <input
                  type="radio"
                  name="language"
                  checked={params.get("language") === "vi"}
                  onChange={(e) => setLanguageQuery(e.target.value)}
                  value={"vi"}
                  className="radio radio-sm checked:bg-blue-500"
                />
                <span className="label-text">Vietnamese</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label space-x-4 cursor-pointer justify-start">
                <input
                  checked={params.get("language") === "fr"}
                  onChange={(e) => setLanguageQuery(e.target.value)}
                  value={"fr"}
                  type="radio"
                  name="language"
                  className="radio radio-sm checked:bg-blue-500"
                />
                <span className="label-text">French</span>
              </label>
            </div>
          </div>

          <div className="mt-4">
            <h4>Categories</h4>

            <div>
              {!isCategoriesLoading &&
                categories &&
                categories.slice(0, showMoreCategories ? undefined : 10).map((category) => {
                  return (
                    <div key={category.id} className="form-control">
                      <label className="label space-x-4 cursor-pointer justify-start">
                        <input
                          type="radio"
                          name="category"
                          value={category.id}
                          checked={Number(params.get("category")) === category.id}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setParams((p) => {
                                p.set("category", category.id);

                                return p;
                              });
                            }
                          }}
                          className="radio radio-sm checked:bg-blue-500"
                        />
                        <span className="label-text">{category.name}</span>
                      </label>
                    </div>
                  );
                })}

              <div
                role="button"
                onClick={() => setShowMoreCategories((v) => !v)}
                className="text-sm text-primary mt-2 text-center"
              >
                View {showMoreCategories ? "less" : "more"}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-8">
          {!isLoading && data && data.events.length > 0 && (
            <div>
              <div className="space-y-10">
                {data.events.map((event) => {
                  return (
                    <Link to={`/e/${event.slug}`} key={event.id}>
                      <EventRowCardItem event={event} />
                    </Link>
                  );
                })}
              </div>

              <div className="flex justify-center mt-8">
                <div className="join">
                  <button
                    onClick={() => {
                      const page = Number(params.get("page")) || 1;

                      if (page && page <= 1) return;

                      setParams((params) => {
                        params.set("page", `${page - 1}`);
                        return params;
                      });
                    }}
                    className="join-item btn btn-sm"
                  >
                    «
                  </button>
                  <button className="join-item btn btn-sm">Page {params.get("page") || 1}</button>
                  <button
                    onClick={() => {
                      const page = Number(params.get("page")) || 1;

                      if (page && page >= Math.ceil(data.total / 10)) return;

                      setParams((params) => {
                        params.set("page", `${page + 1}`);

                        return params;
                      });
                    }}
                    className="join-item btn btn-sm"
                  >
                    »
                  </button>
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="mt-10 p-10 center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default SearchEvents;
