import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@awesome.me/kit-9b926a9ec0/icons/duotone/solid";
import { faBars } from "@awesome.me/kit-9b926a9ec0/icons/classic/solid";
import ThemeToggle from "/src/components/theme";

const Footer = ({ setTheme }) => {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-secondary-950 dark:text-gray-200 transition-colors duration-500 ease-out py-4 px-6 mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
                <div>
                    <span className="font-bold text-lg leading-tight">The Synergy solution<br />for implement<br />DMS®</span>
                </div>

                <div>
                     <span className="text-lg">Company 1</span> <br/>
                    <span><a href="mailto:newbusiness@weareimpero.com" className="underline">extranet.ae</a></span> <br/>
                    <span>Office #3,C2, </span> <br/>
                    <span>King Fowzia Building,</span> <br/>
                    <span>Garhoud, Dubai, AE</span> <br/>
                    <a href="https://extranet.ae/portal/synergysolutions" className="underline mt-1 inline-block">SEE ON SITE →</a>
                </div>

                <div>
                    <span className="text-lg">Company 2</span> <br/>
                    <span><a href="https://synergysolution.co.in/portal/synergy-solutions-india" className="underline">synergysolution.co</a></span> <br/>
                    <span>Z-24, Zone-1, Maharana Pratap</span> <br/>
                    <span>Nagar</span> <br/>
                    <span>Bhopal, Madhya Pradesh 462011, IN</span> <br/>
                    <a href="https://synergysolution.co.in/portal/synergy-solutions-india" className="underline mt-1 inline-block">SEE ON SITE →</a>
                </div>

                <div>
                    <span className="text-lg">Company<br />IN YOUR OFFICE?</span>
                    <a href="#" className="underline block mb-4">SIGN UP FOR OUR NEWSLETTER →</a>
                    <h4 className="font-semibold mb-2">FOLLOW US</h4>
                    <div className="flex space-x-4">
                        <a href="#"><i className="fab fa-behance"></i></a>
                        <a href="#"><i className="fab fa-dribbble"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
            </div>
        </footer>

    );
};

export default Footer;