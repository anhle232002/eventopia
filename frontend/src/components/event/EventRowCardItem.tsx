function EventRowCardItem({ event }: { event: any }) {
  return (
    <div>
      <div
        role="button"
        className="grid grid-cols-12 gap-8  hover:shadow-[0px_2px_20px_5px_rgba(0,0,0,0.2)] p-4 rounded-md duration-300"
      >
        <div className="col-span-4">
          <img
            className="rounded-md"
            src="https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F551246309%2F684278340823%2F1%2Foriginal.20230709-051025?w=512&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C60%2C1920%2C960&s=2aed127b321f6e666a7acfb824684268"
            alt=""
          />
        </div>

        <div className="col-span-8 space-y-2">
          <h2 className="font-semibold">FRIDAY SOCIALS meetups</h2>

          <div className="text-sm">Fri, Jul 21 • 5:00 PM</div>

          <div className="text-sm opacity-80">PĀMA Boutique Hotel & Bistro </div>

          <div>Online</div>
        </div>
      </div>
    </div>
  );
}
export default EventRowCardItem;
