const PDFDocument = require('pdfkit');
const Dispute = require('../models/Dispute');
const Evidence = require('../models/Evidence');

exports.exportCase = async (req, res) => {
    try {
        const dispute = await Dispute.findById(req.params.disputeId);
        if (!dispute) return res.status(404).json({ message: 'Dispute not found' });

        const evidence = await Evidence.find({ _id: { $in: dispute.evidenceIds } });

        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=case_${dispute._id}.pdf`);

        doc.pipe(res);

        doc.fontSize(20).text('Gig Worker Dispute Case File', { align: 'center' });
        doc.moveDown();

        doc.fontSize(14).text(`Case ID: ${dispute._id}`);
        doc.text(`Date: ${dispute.createdAt}`);
        doc.text(`Status: ${dispute.status}`);
        doc.moveDown();

        doc.fontSize(16).text('Appeal Letter', { underline: true });
        doc.moveDown();

        try {
            const letter = JSON.parse(dispute.appealLetter);
            doc.fontSize(12).text(`Subject: ${letter.subject}`);
            doc.moveDown();
            doc.text(letter.body);
            doc.moveDown();
            doc.text('Summary Points:');
            letter.summaryPoints.forEach(pt => doc.text(`- ${pt}`));
        } catch (e) {
            doc.text(dispute.appealLetter);
        }

        doc.moveDown();
        doc.fontSize(16).text('Evidence Log', { underline: true });
        doc.moveDown();

        evidence.forEach((ev, index) => {
            doc.fontSize(12).text(`Evidence #${index + 1}`);
            doc.text(`ID: ${ev._id}`);
            doc.text(`SHA-256: ${ev.sha256}`);
            doc.text(`S3 URL: ${ev.s3Url}`);
            doc.text(`Tags: ${ev.tags.join(', ')}`);
            doc.moveDown();
        });

        doc.end();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
