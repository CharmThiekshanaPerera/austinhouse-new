import { apiRequest } from "./apiClient";

export type GalleryCategory = "Environment" | "Treatments" | "Results" | "Products" | "Before/After";

export interface GalleryImage {
    id: string;
    image: string;
    alt: string;
    category: GalleryCategory;
    type: "image" | "video";
}

export type GalleryImageCreate = Omit<GalleryImage, "id">;
export type GalleryImageUpdate = Partial<GalleryImageCreate>;

export const galleryImagesApi = {
    list: () => apiRequest<GalleryImage[]>("/api/gallery/images"),
    create: (data: GalleryImageCreate) => apiRequest<GalleryImage>("/api/gallery/images", { method: "POST", body: data }),
    update: (id: string, data: GalleryImageUpdate) => apiRequest<GalleryImage>(`/api/gallery/images/${id}`, { method: "PATCH", body: data }),
    remove: (id: string) => apiRequest<void>(`/api/gallery/images/${id}`, { method: "DELETE" }),
};

export interface BeforeAfterPair {
    id: string;
    before_image: string;
    after_image: string;
    title: string;
    description: string;
}

export type BeforeAfterCreate = Omit<BeforeAfterPair, "id">;
export type BeforeAfterUpdate = Partial<BeforeAfterCreate>;

export const beforeAfterApi = {
    list: () => apiRequest<BeforeAfterPair[]>("/api/gallery/before-after"),
    create: (data: BeforeAfterCreate) => apiRequest<BeforeAfterPair>("/api/gallery/before-after", { method: "POST", body: data }),
    update: (id: string, data: BeforeAfterUpdate) => apiRequest<BeforeAfterPair>(`/api/gallery/before-after/${id}`, { method: "PATCH", body: data }),
    remove: (id: string) => apiRequest<void>(`/api/gallery/before-after/${id}`, { method: "DELETE" }),
};
