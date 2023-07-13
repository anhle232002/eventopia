import EventCardItem from "@/components/event/EventCardItem";
import TrendingCategories from "@/components/home/TrendingCategories";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { useEvents } from "@/hooks/useEvents";
import { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [location, setLocation] = useState<any | null>({});
  const [hasLocation, setHasLocation] = useState(false);
  const { data: currLocation } = useCurrentLocation(
    location.latitude,
    location.longitude,
    hasLocation
  );
  const tabs = [
    { title: "All", query: {} },
    { title: "Online", query: { online: 1 } },
    { title: "Today", query: { date: "today" } },
    { title: "This weekend", query: { date: "this_week" } },
    { title: "This month", query: { date: "this_month" } },
    { title: "Nearby You", query: { lat: location.latitude, long: location.longitude } },
  ];

  const [query, setQuery] = useState({});
  const [selectedTab, setSelectedTab] = useState(0);
  const { data } = useEvents({ ...query });

  function handleGetLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLocation({ latitude, longitude });
          setHasLocation(true);
        },
        () => {
          console.log("Unable to retrieve your location");
        }
      );
    } else {
      console.log("Geolocation not supported");
    }
  }

  return (
    <div className="pb-20">
      <div
        style={{
          backgroundPosition: "50% 100%",
          backgroundImage: `url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')`,
        }}
        className="h-[550px] bg-no-repeat bg-cover relative"
      >
        <button className="btn btn-primary absolute btn-sm bottom-5 left-60">
          Find your next event
        </button>
      </div>

      <div className="max-w-6xl m-auto mt-10 min-h-[500px]">
        <div className="text-2xl">
          <strong>Popular in</strong>
          <span className="ml-4 underline">
            {(selectedTab === tabs.length - 1 && currLocation?.city) || "Online"}
          </span>
        </div>

        <div className="mt-8">
          <div className="tabs">
            {tabs.map((tab, index) => {
              return (
                <a
                  onClick={async () => {
                    if (index === tabs.length - 1) {
                      handleGetLocation();
                      setSelectedTab(index);
                      setQuery(location);
                    } else {
                      setSelectedTab(index);
                    }
                    setQuery(tab.query);
                  }}
                  key={tab.title}
                  className={`tab tab-bordered font-semibold ${
                    selectedTab === index && "tab-active"
                  }`}
                >
                  {tab.title}
                </a>
              );
            })}
          </div>

          <TrendingCategories />
          <div className="mt-10">
            {(selectedTab === tabs.length - 1 && hasLocation) || selectedTab !== tabs.length - 1 ? (
              <div>
                {data && data.events.length > 0 ? (
                  <div className="flex gap-8 flex-wrap">
                    {data.events.map((event) => {
                      return (
                        <Link to={`/e/${event.slug}`}>
                          <EventCardItem key={event.id} event={event} />
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <i className="ri-calendar-event-line text-8xl"></i>
                    <p className="mt-3 text-xl font-semibold">Currently no events</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <i className="ri-calendar-event-line text-8xl"></i>
                <p className="mt-3 text-xl font-semibold">Currently no events</p>
              </div>
            )}
          </div>

          <div className="text-right">
            <Link to="/search">
              <button className="btn btn-primary btn-sm">See more</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
