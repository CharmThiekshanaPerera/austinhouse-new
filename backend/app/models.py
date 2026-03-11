from __future__ import annotations

from typing import List, Optional

from typing import Literal

from pydantic import BaseModel, Field


class ServiceBase(BaseModel):
    image: str
    category: str = "Services"
    title: str
    duration: str
    price: str
    rating: float = Field(ge=0, le=5)
    description: str
    benefits: List[str] = Field(default_factory=list)


class ServiceCreate(ServiceBase):
    id: Optional[str] = None


class ServiceUpdate(BaseModel):
    image: Optional[str] = None
    category: Optional[str] = None
    title: Optional[str] = None
    duration: Optional[str] = None
    price: Optional[str] = None
    rating: Optional[float] = Field(default=None, ge=0, le=5)
    description: Optional[str] = None
    benefits: Optional[List[str]] = None


class ServiceOut(ServiceBase):
    id: str


class ProductBase(BaseModel):
    image: str
    name: str
    category: str
    price: str
    priceNum: float = Field(ge=0)
    description: str


class ProductCreate(ProductBase):
    id: Optional[str] = None


class ProductUpdate(BaseModel):
    image: Optional[str] = None
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[str] = None
    priceNum: Optional[float] = Field(default=None, ge=0)
    description: Optional[str] = None


class ProductOut(ProductBase):
    id: str


InventoryStatus = Literal["Out of Stock", "Low Stock", "In Stock"]


class InventoryBase(BaseModel):
    product_id: str
    sku: str
    stock_qty: int = Field(ge=0)
    reorder_level: int = Field(ge=0)
    supplier: str
    status: InventoryStatus


class InventoryCreate(BaseModel):
    product_id: str
    sku: str
    stock_qty: int = Field(ge=0)
    reorder_level: int = Field(ge=0)
    supplier: str


class InventoryUpdate(BaseModel):
    product_id: Optional[str] = None
    sku: Optional[str] = None
    stock_qty: Optional[int] = Field(default=None, ge=0)
    reorder_level: Optional[int] = Field(default=None, ge=0)
    supplier: Optional[str] = None


class InventoryOut(InventoryBase):
    id: str


class StaffBase(BaseModel):
    name: str
    role: str
    email: str
    phone: Optional[str] = None
    bio: Optional[str] = None
    image: Optional[str] = None
    show_in_frontend: bool = True

class StaffCreate(StaffBase):
    pass

class StaffUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    image: Optional[str] = None
    show_in_frontend: Optional[bool] = None

class StaffOut(StaffBase):
    id: str


class CustomerBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    total_spent: float = Field(default=0.0, ge=0)
    last_visit: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    total_spent: Optional[float] = Field(default=None, ge=0)
    last_visit: Optional[str] = None

class CustomerOut(CustomerBase):
    id: str


BookingStatus = Literal["Pending", "Confirmed", "Cancelled", "Completed"]

class BookingBase(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    service_id: str
    staff_id: Optional[str] = None
    date: str
    time: str
    status: BookingStatus = "Pending"
    notes: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    service_id: Optional[str] = None
    staff_id: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    status: Optional[BookingStatus] = None
    notes: Optional[str] = None

class BookingOut(BookingBase):
    id: str


class WaitlistEntryBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    preferred_date: str
    service_id: str
    notes: Optional[str] = None

class WaitlistEntryCreate(WaitlistEntryBase):
    pass

class WaitlistEntryUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    preferred_date: Optional[str] = None
    service_id: Optional[str] = None
    notes: Optional[str] = None

class WaitlistEntryOut(WaitlistEntryBase):
    id: str


class BlogPostBase(BaseModel):
    title: str
    slug: str
    content: str
    author_id: str
    published: bool = False
    image: Optional[str] = None

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    author_id: Optional[str] = None
    published: Optional[bool] = None
    image: Optional[str] = None

class BlogPostOut(BlogPostBase):
    id: str


class TestimonialBase(BaseModel):
    text: str
    author: str
    rating: float = Field(default=5.0, ge=0, le=5)

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialUpdate(BaseModel):
    text: Optional[str] = None
    author: Optional[str] = None
    rating: Optional[float] = Field(default=None, ge=0, le=5)

class TestimonialOut(TestimonialBase):
    id: str


class ContactMessageBase(BaseModel):
    name: str
    email: str
    subject: str
    message: str
    read: bool = False
    replied: bool = False


class ContactMessageCreate(ContactMessageBase):
    pass


class ContactMessageUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    subject: Optional[str] = None
    message: Optional[str] = None
    read: Optional[bool] = None
    replied: Optional[bool] = None


class ContactMessageOut(ContactMessageBase):
    id: str
    createdAt: str


GalleryCategory = Literal["Environment", "Treatments", "Results", "Products", "Before/After"]

class GalleryImageBase(BaseModel):
    image: str
    alt: str
    category: GalleryCategory
    type: Literal["image", "video"] = "image"

class GalleryImageCreate(GalleryImageBase):
    pass

class GalleryImageUpdate(BaseModel):
    image: Optional[str] = None
    alt: Optional[str] = None
    category: Optional[GalleryCategory] = None
    type: Optional[Literal["image", "video"]] = None

class GalleryImageOut(GalleryImageBase):
    id: str


class BeforeAfterBase(BaseModel):
    before_image: str
    after_image: str
    title: str
    description: str

class BeforeAfterCreate(BeforeAfterBase):
    pass

class BeforeAfterUpdate(BaseModel):
    before_image: Optional[str] = None
    after_image: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None

class BeforeAfterOut(BeforeAfterBase):
    id: str


class SubscriberBase(BaseModel):
    email: str
    active: bool = True
    created_at: str

class SubscriberCreate(BaseModel):
    email: str

class SubscriberUpdate(BaseModel):
    active: bool

class SubscriberOut(SubscriberBase):
    id: str
