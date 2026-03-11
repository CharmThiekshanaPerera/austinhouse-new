import fs from 'fs';
import path from 'path';

const basePath = "d:/Charm Thiekshana Projects/Austin House New/austinhouse-new/src/pages/services";

const filesToProcess = [
    { file: "ChemicalPeels.tsx", category: "Chemical Peels", arrayName: "peelsData" },
    { file: "WaxingTreatments.tsx", category: "Waxing Treatments", arrayName: "servicesData" },
    { file: "SpecializedProcedures.tsx", category: "Specialized Procedures", arrayName: "servicesData" },
    { file: "AntiAgingTreatments.tsx", category: "Anti-aging Skin Tightening Treatments", arrayName: "servicesData" },
    { file: "IntimateAreaServices.tsx", category: "Intimate Area Services", arrayName: "servicesData" },
    { file: "WartRemoval.tsx", category: "Wart Removal", arrayName: "servicesData" },
    { file: "MicroDermabrasion.tsx", category: "Micro-Dermabrasion", arrayName: "servicesData" },
];

for (const { file, category, arrayName } of filesToProcess) {
    const filePath = path.join(basePath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Add Imports
    if (!content.includes('import BookingModal')) {
        content = content.replace(
            /import ServiceModal, \{ ServiceData \} from "@\/components\/ServiceModal";/,
            `import ServiceModal, { ServiceData } from "@/components/ServiceModal";\nimport { useData } from "@/contexts/DataContext";\nimport BookingModal from "@/components/BookingModal";`
        );
    }

    // 2. Remove the array completely (regex to match const arrayName = [ ... ];)
    // We can confidently use a regex that finds `const ${arrayName} = [` and deletes until `];`
    const arrayRegex = new RegExp(`const ${arrayName} = \\[([\\s\\S]*?)\\];\\s*`, 'g');
    content = content.replace(arrayRegex, '');

    // 3. Add useData and state
    const componentRegex = new RegExp(`const ${file.replace('.tsx', '')} = \\(\\) => {`);
    content = content.replace(
        componentRegex,
        `const ${file.replace('.tsx', '')} = () => {\n    const { services } = useData();\n    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);\n    const [bookingServiceTitle, setBookingServiceTitle] = useState("");\n    const pageServices = services.filter(s => s.category === "${category}");`
    );

    // 4. Replace mapping
    content = content.replace(new RegExp(`${arrayName}\\.map`, 'g'), `pageServices.map`);

    // 5. Replace Link with Button
    content = content.replace(
        /<Link\s*to=\{`\/contact\?service=\$\{service\.id\}`\}\s*className="([^"]+)"\s*>\s*Book Now\s*<\/Link>/g,
        `<button onClick={() => { setBookingServiceTitle(service.title); setIsBookingModalOpen(true); }} className="$1">Book Now</button>`
    );

    // 6. Add BookingModal
    content = content.replace(
        /<\/div>\s*<ServiceModal/g,
        `<BookingModal open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen} preselectedService={bookingServiceTitle} />\n            </div>\n            <ServiceModal`
    );
    // Alternatively, just inject before the final </div>
    content = content.replace(
        /<ServiceModal([^>]+)\/>\s*<\/div>/,
        `<ServiceModal$1/>\n            <BookingModal open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen} preselectedService={bookingServiceTitle} />\n        </div>`
    );

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
}
