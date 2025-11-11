import { useState } from 'react'

function App() {
  const [clinicalFile, setClinicalFile] = useState(null)
  const [imageFiles, setImageFiles] = useState([])
  const [imageMap, setImageMap] = useState('filename,label\nexample1.png,1\nexample2.png,0')
  const [result, setResult] = useState(null)
  const backend = import.meta.env.VITE_BACKEND_URL || ''

  const handleTrain = async () => {
    if (!clinicalFile || imageFiles.length === 0) {
      alert('Please upload clinical CSV and at least one image')
      return
    }
    const fd = new FormData()
    fd.append('clinical_csv', clinicalFile)
    for (const f of imageFiles) fd.append('images', f)
    fd.append('image_map', imageMap)
    fd.append('epochs', '2')
    fd.append('image_size', '224')

    const res = await fetch(`${backend}/train`, { method: 'POST', body: fd })
    const data = await res.json()
    setResult(data)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">CMMD Hybrid Breast Cancer Detection (Demo)</h1>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Clinical CSV</label>
          <input type="file" accept=".csv" onChange={(e)=> setClinicalFile(e.target.files[0])} />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Mammogram Images</label>
          <input type="file" accept="image/*" multiple onChange={(e)=> setImageFiles(Array.from(e.target.files))} />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Image Map (CSV text)</label>
          <textarea className="w-full border rounded p-2 h-32" value={imageMap} onChange={(e)=> setImageMap(e.target.value)} />
        </div>
        <button onClick={handleTrain} className="px-4 py-2 bg-indigo-600 text-white rounded">Train</button>
        {result && (
          <div className="p-4 bg-white rounded shadow">
            <div>Accuracy: {result.accuracy}</div>
            <div>AUC: {result.auc}</div>
            {result.note && <div className="text-sm text-gray-500">{result.note}</div>}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
