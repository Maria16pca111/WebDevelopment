import { Component, output, model, input, computed } from '@angular/core';

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent {
  pageNumber= model(1);
  pageSize= model(5);
  totalCount= input(0);
  totalPages= input(0);

  pageChange = output<{currentPage: number, pageSize: number }>();
  pageSizeOptions = input([5, 10, 20, 50]);

  lastItemIndex = computed( () =>
  {
    return Math.min(this.pageNumber() * this.pageSize(), this.totalCount())
  });

  onPageChange(newPage?: number, pageSize?: EventTarget | null)
  {
    if(newPage) this.pageNumber.set(newPage);
    if(pageSize)
    {
        const size = Number((pageSize as HTMLSelectElement).value);
        this.pageSize.set(size);
    }

    this.pageChange.emit(
      {
        currentPage: this.pageNumber(),
        pageSize: this.pageSize()
      }
    );
  }
}
