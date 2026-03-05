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
