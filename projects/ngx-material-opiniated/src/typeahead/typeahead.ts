﻿// tslint:disable-next-line: max-line-length
import {Component, EventEmitter, TemplateRef, ViewChild, ElementRef, ContentChild, Input, Output, OnChanges, Optional, Inject} from '@angular/core';
import { Observable, from, ObservableInput } from 'rxjs';
import { INotificationService } from '../services';
import { FormControl } from '@angular/forms';
import { startWith, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { graphMatches } from '../utils';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

// ================================================
@Component({
    selector: 'typeahead',
    styleUrls: ['./typeahead.scss'],
    templateUrl: './typeahead.html',
})
export class OpiniatedTypeaheadComponent<T> implements OnChanges {

    faPlus = faPlus;
    searchControl = new FormControl();

    @Input()
    source: T[] | ((q: string) => ObservableInput<T[]>);

    @Input()
    displayWith: string | ((x: T) => string[]);
    @Input()
    displayWithFn: ((x: T) => string[]);

    displayWithInternal: ((x: T) => string[]);

    @Input()
    placeholder: string;
    @Input()
    searchWhenEmpty = false;

    text: string;
    @Input()
    create: (text: string) => Promise<T>;

    private _value: T;
    @Output()
    valueChange = new EventEmitter<T>();
    @Output()
    blur = new EventEmitter<T>();

    @Output()
    emptyValue = new EventEmitter<T>();

    @ContentChild(TemplateRef) itemTemplate: TemplateRef<any>;
    @ViewChild('createRef') createRef;
    @ViewChild('input') input;

    _createTag = {};
    creating = false;

    filteredOptions = this.searchControl.valueChanges
        .pipe(
            startWith(null),
            debounceTime(200),
            distinctUntilChanged(),
            switchMap(val => {
                return this.filter(val || '');
            })
        );

    filter(val: string): Observable<T[]> {
        if (typeof val !== 'string') {
            val = '';
        }
        const src = this.source;
        if (src instanceof Array) {
            return from([src.filter(x => graphMatches(x, val))]);
        }
        if (!val && !this.searchWhenEmpty || !src) {
            return from([[]]);
        }
        const data = src(val);
        return from(data)
            .pipe(catchError(x => {
                (this.notif || console).error(x);
                return from([[]]);
            }));
    }

    async onCreate() {
        try {
            this.creating = true;
            const val = await this.create(this.text);
            if (val) {
                this.setValue(val);
                this.searchControl.setValue(val);
            }
            this.onBlur();
        } catch (e) {
            (this.notif || console).error(e);
            this.onBlur();
        }
    }

    onBlur() {
        setTimeout(() => {
            if (this.creating) {
                return;
            }
            this.blur.emit();
        }, 1);
    }

    ngOnChanges(ch) {
        if ('displayWith' in ch) {
            const key = this.displayWith;
            this.displayWithInternal = typeof key === 'string'
                ? x => x ? x[key] : ''
                : key;
        }
        if ('displayWithFn' in ch) {
            this.displayWithInternal = this.displayWithFn;
        }
    }


    constructor(
        @Optional() @Inject(INotificationService) private notif: INotificationService
        , elt: ElementRef
    ) {
        if (elt.nativeElement) {
            elt.nativeElement.focus = () => setTimeout(() => this.input.nativeElement.focus());
        }
        this.searchControl.valueChanges.subscribe(x => {
            this.setValue(x);
            this.text = x;
        });
    }

    isEmpty(ref: Element) {
        if (ref.childNodes.length === 1) {
            return ref.childNodes[0]['hidden'] || ref.childNodes[0].childNodes.length === 0;
        }
        return ref.childNodes.length === 0;
    }


    @Input()
    set value(v: T) {
        if (v === this._value) {
            return;
        }
        this._value = v;
        this.searchControl.setValue(v);
    }

    setValue(v: T) {
        if (v === this._value) {
            return;
        }
        this._value = v;
        this.valueChange.emit(v);
    }

    get value() {
        return this._value;
    }

    onEmptyInput(event: any) {
        if (event.key === 'Backspace' && !this.value) {
            this.emptyValue.emit();
        }
    }
}