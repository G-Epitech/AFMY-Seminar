//
//  Customer.swift
//  SoulConnection
//
//  Created by Matheo Coquet on 10/09/2024.
//

import Foundation

struct Customer: Codable, Identifiable {
    var id: Int
    var legacyId: Int?
    var email: String
    var name: String
    var surname: String
    var description: String
    var birthDate: String
    var gender: String
    var sign: String
    var phone: String?
    var photo: String?
    var photoFormat: String?
    var address: String?
    var coachId: Int?
    var createdAt: String
    var paymentMethods: [String]?
    var country: String?
}

struct CustomerPage: Codable {
    var index: Int
    var size: Int
    var totalPages: Int?
    var isLast: Bool
    var items: [Customer]
}
