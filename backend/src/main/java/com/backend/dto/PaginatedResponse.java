package com.backend.dto;

import java.util.List;

import org.springframework.data.domain.Page;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaginatedResponse<T> {

    private List<T> capsules;
    private Pagination pagination;
    
    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class Pagination {
        private int currentPage;
        private int totalPages;
        private long totalItems;
        private int itemsPerPage;
        private boolean hasNextPage;
        private boolean hasPrevPage;
        
        public Pagination(Page<?> page) {
            this.currentPage = page.getNumber() + 1;
            this.totalPages = page.getTotalPages();
            this.totalItems = page.getTotalElements();
            this.itemsPerPage = page.getSize();
            this.hasNextPage = page.hasNext();
            this.hasPrevPage = page.hasPrevious();
        }
    }
}

