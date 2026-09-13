"use client";

import Link from "next/link";
import { Camera, MapPin, Mail, MessageCircle, Phone } from "lucide-react";
import { academy } from "@/lib/site";

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
    "Grammar & Vocabulary",
    "Teacher Training",
];

const socials = [
    { label: "WhatsApp", href: academy.whatsappHref, icon: MessageCircle },
    { label: "Instagram", href: academy.instagramHref, icon: Camera },
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
                                <p className="text-lg font-black tracking-tight">{academy.name}</p>
                                <p className="text-[10px] uppercase tracking-[0.18em] text-blue-200">{academy.tagline}</p>
                            </div>
                        </div>

                        <p className="mt-5 text-sm leading-7 text-blue-100">{academy.tagline}</p>

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
                        <h3 className="text-lg font-bold text-white">Courses</h3>
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
                                <span>{academy.shortAddress}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-blue-200" />
                                <a href={academy.phoneHref} className="hover:text-white">{academy.phoneDisplay}</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-blue-200" />
                                <a href={academy.emailHref} className="hover:text-white">{academy.email}</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-white/10 pt-6">
                    <p className="text-center text-sm text-blue-200">
                        © 2026 {academy.name}. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}