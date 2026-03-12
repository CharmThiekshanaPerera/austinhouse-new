import fs from 'fs';
import path from 'path';

const basePath = "d:/Charm Thiekshana Projects/Austin House New/austinhouse-new/src/pages/services";

const files = [
    "Facials.tsx",
    "ChemicalPeels.tsx",
    "WaxingTreatments.tsx",
    "SpecializedProcedures.tsx",
    "AntiAgingTreatments.tsx",
    "IntimateAreaServices.tsx",
    "WartRemoval.tsx",
    "MicroDermabrasion.tsx",
];

for (const file of files) {
    const filePath = path.join(basePath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(
        /<ServiceModal \s*isOpen=\{isModalOpen\}\s*onClose=\{\(\) => setIsModalOpen\(false\)\}\s*service=\{selectedService\}\s*\/>/g,
        `<ServiceModal \n                isOpen={isModalOpen}\n                onClose={() => setIsModalOpen(false)}\n                service={selectedService}\n                onBookNow={(title) => {\n                    setIsModalOpen(false);\n                    setBookingServiceTitle(title);\n                    setIsBookingModalOpen(true);\n                }}\n            />`
    );

    fs.writeFileSync(filePath, content);
    console.log(`Updated onBookNow for ${file}`);
}
