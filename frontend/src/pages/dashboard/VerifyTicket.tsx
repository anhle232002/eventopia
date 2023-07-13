import { processTicket } from "@/api/process-ticket";
import { useTicketInfo } from "@/hooks/useTicketInfo";
import { formatDate } from "@/utils";
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

function VerifyTicket() {
  const scanner = useRef<Html5Qrcode | null>(null);
  const [cameraId, setCameraId] = useState("");
  const [result, setResult] = useState("");
  const { data, isLoading } = useTicketInfo(result);

  async function onScanSuccess(decodedText: any, decodedResult: any) {
    setResult(decodedText);
    scanner.current?.stop();
  }

  function onScanFailure(error: any) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    // console.warn(`Code scan error = ${error}`);
  }
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setCameraId(devices[0].id);
        }
      })
      .catch((err) => {
        console.log("what", err);
      });
  }, []);

  useEffect(() => {
    if (scanner && cameraId && !result) {
      scanner.current = new Html5Qrcode("reader");

      scanner.current
        .start(
          cameraId,
          {
            fps: 10, // Optional, frame per seconds for qr code scanning
            qrbox: { width: 250, height: 250 }, // Optional, if you want bounded box UI
          },
          onScanSuccess,
          onScanFailure
        )
        .catch((err) => {
          // Start failed, handle it.
          console.log(err);
        });
    }
    return () => {
      if (scanner.current?.isScanning) {
        scanner.current?.stop();
      }
    };
  }, [cameraId, result]);

  return (
    <div className="px-20 py-10">
      <h3 className="font-bold text-lg">Verify ticket</h3>
      <p className="mt-2 text-center mb-10">Scan QR code in your ticket</p>
      {!result && (
        <div id="reader" className="max-w-5xl mt-4 rounded-md overflow-hidden m-auto"></div>
      )}

      {result && (
        <div className="text-end">
          <button
            onClick={() => {
              setResult("");
            }}
            className="btn btn-primary btn-sm"
          >
            Scan again
          </button>
        </div>
      )}

      {isLoading && <div>Loading...</div>}

      {!isLoading && data && <TicketInfo ticket={data} />}
    </div>
  );
}
export default VerifyTicket;

function TicketInfo({ ticket }: { ticket: any }) {
  const handleClickAllowTicket = async () => {
    const response = await processTicket(ticket.id, true);
  };

  const handleClickRejectTicket = async () => {
    const response = await processTicket(ticket.id, false);
  };
  return (
    <div>
      <div className="card card-compact max-w-3xl m-auto bg-base-100 shadow-xl">
        <figure>
          <img className="w-full h-[300px]" src={ticket.event.images[0].url} alt="Shoes" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            Ticket
            <div className="badge badge-secondary capitalize badge-lg">{ticket.status}</div>
          </h2>
          <ul className="text-lg space-y-2 px-6">
            <li className="grid grid-cols-12">
              <span className="font-semibold me-4 col-span-2">Event:</span>{" "}
              <span className="col-span-10 text-left">{ticket.event.title}</span>
            </li>
            <li className="grid grid-cols-12">
              <span className="font-semibold me-4 col-span-2">Date:</span>
              <span className="col-span-10 text-left">{formatDate(ticket.event.startDate)}</span>
            </li>
            <li className="grid grid-cols-12">
              <span className="font-semibold me-4 col-span-2">Price:</span>
              <span className="col-span-10 text-left">{ticket.price}$</span>
            </li>
            <li className="grid grid-cols-12">
              <span className="font-semibold me-4 col-span-2">Type:</span>
              <span className="col-span-10 text-left">{ticket.type}</span>
            </li>
            <li className="grid grid-cols-12">
              <span className="font-semibold me-4 col-span-2">Email:</span>
              <span className="col-span-10 text-left">{ticket.customerEmail}</span>
            </li>
            <li className="grid grid-cols-12">
              <span className="font-semibold me-4 col-span-2">Name:</span>
              <span className="col-span-10 text-left">{ticket.customerName}</span>
            </li>
            <li className="grid grid-cols-12">
              <span className="font-semibold me-4 col-span-2">CID:</span>
              <span className="col-span-10 text-left">{ticket.customerCID}</span>
            </li>
          </ul>
          <div className="card-actions justify-end gap-10">
            <button onClick={handleClickRejectTicket} className="btn btn-primary btn-outline">
              Reject
            </button>
            <button onClick={handleClickAllowTicket} className="btn btn-primary">
              Allow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
