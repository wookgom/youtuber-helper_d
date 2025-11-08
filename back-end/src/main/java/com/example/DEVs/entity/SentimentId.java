package com.example.DEVs.entity;

import lombok.EqualsAndHashCode;

import java.io.Serializable;

@EqualsAndHashCode
public class SentimentId implements Serializable {
    private String videoId;
    private String timeline;
}