import React, { useState } from 'react'
import { motion } from 'framer-motion'

const API_URL = 'http://127.0.0.1:8000/detect'

export default function DetectionPlayground() {
  const [image, setImage] = useState(null)
  const [detections, setDetections] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [imageSize, setImageSize] = useState({
    width: 1,
    height: 1
  })

  const resetState = () => {
    setDetections([])
    setError('')
    setMessage('')
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]

    if (!file) return

    resetState()

    // Validate image
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image.')
      return
    }

    setLoading(true)

    const imageURL = URL.createObjectURL(file)
    setImage(imageURL)

    const img = new Image()

    img.onload = async () => {
      setImageSize({
        width: img.width,
        height: img.height
      })

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch(API_URL, {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Server error')
        }

        const data = await response.json()

        console.log('AI RESPONSE:', data)

        if (data.success) {
          setDetections(data.detections || [])
          setMessage(data.message || '')

          if (data.detections?.length === 0) {
            setMessage('No potholes detected')
          }
        } else {
          setError(data.error || 'Detection failed.')
        }

      } catch (err) {
        console.error(err)
        setError('Backend connection failed.')
      } finally {
        setLoading(false)
      }
    }

    img.src = imageURL
  }

  return (
    <section
      id="ai-playground"
      className="py-24 px-6 md:px-12 bg-[#08111f] border-y border-white/5"
    >
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-14">

          <p className="text-cyan-400 uppercase tracking-[0.25em] text-xs font-semibold mb-4">
            AI Detection Playground
          </p>

          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Real-Time AI Pothole Detection
          </h2>

          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload a road image to test YOLOv8 pothole detection powered by FastAPI.
          </p>

        </div>

        {/* MAIN CARD */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

          {!image ? (

            <label className="border-2 border-dashed border-white/10 rounded-3xl min-h-[420px] flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400/40 transition-all duration-300">

              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
              />

              <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center mb-6">

                <svg
                  className="w-10 h-10 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                  />
                </svg>

              </div>

              <h3 className="text-white text-2xl font-bold mb-3">
                Upload Road Image
              </h3>

              <p className="text-slate-400 text-sm">
                Upload a road surface image to simulate AI-powered pothole
                detection using object detection workflows.
              </p>

              <p className="text-slate-400 text-sm">
                JPG, PNG, WEBP supported
              </p>

            </label>

          ) : (

            <div className="space-y-8">

              {/* IMAGE */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10">

                <img
                  src={image}
                  alt="Uploaded"
                  className="w-full h-auto"
                />

                {/* DETECTIONS */}
                {detections.map((det, index) => {

                  const left =
                    (det.x1 / imageSize.width) * 100

                  const top =
                    (det.y1 / imageSize.height) * 100

                  const width =
                    ((det.x2 - det.x1) / imageSize.width) * 100

                  const height =
                    ((det.y2 - det.y1) / imageSize.height) * 100

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute border-[3px] border-emerald-400 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                      style={{
                        left: `${left}%`,
                        top: `${top}%`,
                        width: `${width}%`,
                        height: `${height}%`
                      }}
                    >

                      {/* LABEL */}
                      <div className="absolute -top-9 left-0 bg-emerald-400 text-black text-xs font-black px-3 py-1 rounded-lg whitespace-nowrap">

                        Pothole • {det.confidence}%

                      </div>

                    </motion.div>
                  )
                })}

              </div>

              {/* LOADING */}
              {loading && (
                <div className="flex items-center gap-3 text-cyan-400">

                  <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>

                  Running YOLOv8 inference...

                </div>
              )}

              {/* SUCCESS MESSAGE */}
              {!loading && message && !error && (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 px-5 py-4">

                  {message}

                </div>
              )}

              {/* ERROR */}
              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300 px-5 py-4">

                  {error}

                </div>
              )}

              {/* DETECTION COUNT */}
              {!loading && detections.length > 0 && (
                <div className="flex items-center gap-3 text-white">

                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>

                  <span className="font-semibold">
                    {detections.length} pothole(s) detected
                  </span>

                </div>
              )}

              {/* RESET */}
              <button
                onClick={() => {
                  setImage(null)
                  resetState()
                }}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
              >
                Upload Another Image
              </button>

            </div>
          )}
        </div>

        {/* FOOTER STATS */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">
              Backend
            </p>

            <h3 className="text-white text-xl font-bold">
              FastAPI
            </h3>

          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">
              Detection Model
            </p>

            <h3 className="text-white text-xl font-bold">
              YOLOv8 Segmentation
            </h3>

          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">
              Inference Speed
            </p>

            <h3 className="text-white text-xl font-bold">
              Real-Time
            </h3>

          </div>

        </div>
      </div>
    </section>
  )
}