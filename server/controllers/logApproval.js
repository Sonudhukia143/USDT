export default async function logApproval(req, res) {
    const data = req.body;
    if (!data) return res.status(400).json({ message: "No data provided" });

    try {
        console.log("Data received in addInfo:", data);
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}