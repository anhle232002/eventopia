import { CCol, CRow } from '@coreui/react'
import { Html5Qrcode } from 'html5-qrcode'
import React, { useEffect, useRef, useState } from 'react'
import { useTicketInfo } from 'src/hooks/useTicketInfo'
import TicketInfo from './TicketInfo'

function VerifyTicket() {
  const scanner = useRef(null)
  const [cameraId, setCameraId] = useState('')
  const [result, setResult] = useState('')
  const { data, isLoading } = useTicketInfo(result)

  async function onScanSuccess(decodedText, decodedResult) {
    setResult(decodedText)
    scanner.current?.stop()
  }

  function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    // console.warn(`Code scan error = ${error}`);
  }

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setCameraId(devices[0].id)
        }
      })
      .catch((err) => {
        console.log('what', err)
      })
  }, [])

  useEffect(() => {
    if (scanner && cameraId && !result) {
      scanner.current = new Html5Qrcode('reader')

      scanner.current
        .start(
          cameraId,
          {
            fps: 10, // Optional, frame per seconds for qr code scanning
            qrbox: { width: 450, height: 450 }, // Optional, if you want bounded box UI
          },
          onScanSuccess,
          onScanFailure,
        )
        .catch((err) => {
          // Start failed, handle it.
          console.log(err)
        })
    }
    return () => {
      if (scanner.current?.isScanning) {
        scanner.current?.stop()
      }
    }
  }, [cameraId, result])

  return (
    <CRow>
      <CCol md={10}>
        <h3>Verify ticket</h3>
        <p>Scan QR code in your ticket</p>

        {!result && <div id="reader"></div>}

        {result && (
          <div>
            <button
              onClick={() => {
                setResult('')
              }}
            >
              Scan again
            </button>
          </div>
        )}

        {isLoading && <div>Loading...</div>}

        {!isLoading && data && <TicketInfo onClose={() => setResult('')} ticket={data} />}
      </CCol>
    </CRow>
  )
}

export default VerifyTicket
