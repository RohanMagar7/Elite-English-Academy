"use client";

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white py-10">
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-8">

        <div>
          <h2 className="text-2xl font-bold text-yellow-400">
            Elite English Academy
          </h2>

          <p className="mt-3 text-gray-300">
            Near Sai Deep Hospital, Mondha Naka, Georai, Beed, Maharashtra.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-3">Contact</h3>
          <p>📞 88887 11228</p>
          <p>📧 elitejamesw182025@gmail.com</p>
        </div>

        <div>
          <h3 className="font-bold mb-3">Quick Links</h3>
          <p>Courses</p>
          <p>Gallery</p>
          <p>Admission</p>
          <p>Contact</p>
        </div>

      </div>

      <p className="mt-8 text-center text-gray-400">
        © 2026 Elite English Academy. All Rights Reserved.
      </p>
    </footer>
  );
}