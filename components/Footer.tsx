"use client";

import Link from "next/link";
import { Camera, Globe, MapPin, Mail, MessageCircle, Phone } from "lucide-react";

const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Courses", href: "/courses" },
    { label: "Gallery", href: "/gallery" },
    { label: "Admission", href: "/admission" },
    { label: "Contact", href: "/contact" },
];

const courseLinks = [
    "Spoken English",
    "IELTS Preparation",
    "Business English",
    "Kids English",
];

const socials = [
    { label: "Facebook", href: "https://facebook.com", icon: Globe },
    { label: "Instagram", href: "https://instagram.com", icon: Camera },
    { label: "WhatsApp", href: "https://wa.me/8801700000000", icon: MessageCircle },
];

export default function Footer() {
    return (
        <footer className="bg-[#0B1F4D] text-white">
            <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 xl:px-14">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-lg font-black text-blue-200">
                                E
                            </div>
                            <div>
                                <p className="text-lg font-black tracking-tight">Elite English</p>
                                <p className="text-xs uppercase tracking-[0.18em] text-blue-200">Academy</p>
                            </div>
                        </div>

                        <p className="mt-5 text-sm leading-7 text-blue-100">
                            Helping students speak English with clarity, confidence, and real-world communication skills.
                        </p>

                        <div className="mt-6 flex items-center gap-3">
                            {socials.map(({ label, href, icon: Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-blue-100 transition hover:bg-white hover:text-[#0B1F4D]"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-white">Quick Links</h3>
                        <ul className="mt-5 space-y-3 text-sm text-blue-100">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="transition hover:text-white">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-white">Popular Courses</h3>
                        <ul className="mt-5 space-y-3 text-sm text-blue-100">
                            {courseLinks.map((course) => (
                                <li key={course}>{course}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-white">Contact</h3>
                        <ul className="mt-5 space-y-4 text-sm text-blue-100">
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-4 w-4 text-blue-200" />
                                <span>Near Sai Deep Hospital, Mondha Naka, Georai, Beed, Maharashtra</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-blue-200" />
                                <a href="tel:+8801700000000" className="hover:text-white">+88 01700-000000</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-blue-200" />
                                <a href="mailto:info@eliteenglishacademy.com" className="hover:text-white">info@eliteenglishacademy.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-white/10 pt-6">
                    <p className="text-center text-sm text-blue-200">
                        © 2026 Elite English Academy. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}