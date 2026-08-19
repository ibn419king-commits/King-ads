export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: false,
      message: "Method not allowed"
    });
  }

  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({
        status: false,
        message: "Payment reference is required"
      });
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      return res.status(400).json({
        status: false,
        message: "Payment verification failed"
      });
    }

    return res.status(200).json({
      status: true,
      message: "Payment verified successfully",
      data: data.data
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error"
    });
  }
}
