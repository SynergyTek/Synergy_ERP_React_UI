import RootLayout from '/src/layouts/layout';
import '/public/styles/global.scss';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { SidebarProvider } from "@/layouts/SidebarContext";
import{UserProvider } from "@/components/UserContext"
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 

function DMS({ Component, pageProps }) {
	ModuleRegistry.registerModules([AllCommunityModule]);
	return (
	  <SidebarProvider>
		<UserProvider >
			<RootLayout>
			<Component {...pageProps} />
			</RootLayout>
		</UserProvider>
	  </SidebarProvider>
	);
}
  

export default DMS;


