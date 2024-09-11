//
//  ListCustomers.swift
//  SoulConnection
//
//  Created by Matheo Coquet on 10/09/2024.
//

import Foundation

func listCustomersAPI(token: String, page: Int) async throws -> CustomerPage
{
    guard let url = URL(string: "\(APIConfig.url)/customers?page=\(page)&size=20") else {
        throw URLError(.badURL)
    }
    
    var request = URLRequest(url: url)
    request.httpMethod = "GET"
    request.timeoutInterval = 20
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    
    let (data, header) = try await URLSession.shared.data(for: request)
    if let httpResponse = header as? HTTPURLResponse {
        let statusCode = httpResponse.statusCode
        
        if statusCode != 200 && statusCode != 201 {
            print("Status: \(statusCode)")
            throw URLError(.dataNotAllowed)
        }
    }

    let response = try JSONDecoder().decode(CustomerPage.self, from: data)
    return response
}
