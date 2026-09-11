"use client";

export default function Footer() {
    return (
        <footer className="bg-primary text-on-primary py-10">
            <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-8">

                <div>
                    <h2 className="text-2xl font-bold text-on-primary">
                        Elite English Academy
                    </h2>

                    <p className="mt-3 text-on-primary/90">
                        Near Sai Deep Hospital, Mondha Naka, Georai, Beed, Maharashtra.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold mb-3 text-on-primary">Contact</h3>
                    <p>📞 88887 11228</p>
                    <p>📧 elitejamesw182025@gmail.com</p>
                </div>

                <div>
                    <h3 className="font-bold mb-3 text-on-primary">Quick Links</h3>
                    <p>Courses</p>
                    <p>Gallery</p>
                    <p>Admission</p>
                    <p>Contact</p>
                </div>

            </div>

            <p className="mt-8 text-center text-on-primary/80">
                © 2026 Elite English Academy. All Rights Reserved.
            </p>
        </footer>
    );
}