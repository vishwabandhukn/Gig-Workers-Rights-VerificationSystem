import React, { useState, useEffect } from 'react';
import api from '../api/axios';

import toast from 'react-hot-toast';

const Evidence = () => {
    const [file, setFile] = useState(null);
    const [tripId, setTripId] = useState('');
    const [tags, setTags] = useState('');
    const [evidenceList, setEvidenceList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchEvidence = async () => {
        try {
            const res = await api.get(`/blackbox/${user._id}`);
            setEvidenceList(res.data.items);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (user._id) fetchEvidence();
    }, [user._id]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('tripId', tripId);
        formData.append('tags', tags);

        try {
            await api.post('/blackbox/upload', formData);
            setFile(null);
            setTripId('');
            setTags('');
            toast.success('Evidence uploaded successfully!');
            fetchEvidence();
        } catch (err) {
            toast.error('Upload failed. Please try again.');
        } finally {
            setUploading(false);
            setFile(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Upload Evidence</h2>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Trip ID (Optional)</span></label>
                            <input type="text" value={tripId} onChange={(e) => setTripId(e.target.value)} className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Tags (comma separated)</span></label>
                            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">File</span></label>
                            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="file-input file-input-bordered w-full" />
                        </div>
                        <button className={`btn btn-primary ${uploading ? 'loading' : ''}`} disabled={uploading}>
                            {uploading ? 'Uploading...' : 'Secure Upload'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Evidence Locker</h2>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Trip ID</th>
                                    <th>SHA-256 Hash</th>
                                    <th>Tags</th>
                                    <th>Link</th>
                                </tr>
                            </thead>
                            <tbody>
                                {evidenceList.map((item) => (
                                    <tr key={item._id}>
                                        <td>{new Date(item.timestamp).toLocaleDateString()}</td>
                                        <td>{item.tripId || 'N/A'}</td>
                                        <td className="font-mono text-xs truncate max-w-xs" title={item.sha256}>{item.sha256}</td>
                                        <td>{item.tags.join(', ')}</td>
                                        <td><a href={item.s3Url} target="_blank" rel="noreferrer" className="link link-primary">View</a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Evidence;
