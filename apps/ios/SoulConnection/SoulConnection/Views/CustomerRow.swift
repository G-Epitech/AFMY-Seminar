//
//  CustomerRow.swift
//  SoulConnection
//
//  Created by Matheo Coquet on 11/09/2024.
//

import SwiftUI

struct CustomerRow: View {
    var customer: Customer

    var body: some View {
        HStack {
            ImageView(urlString: "\(APIConfig.url)\(customer.photo!)")
                .frame(width: 50, height: 50).clipShape(/*@START_MENU_TOKEN@*/Circle()/*@END_MENU_TOKEN@*/)
            Text("\(customer.name) \(customer.surname)")
            
            Spacer()
        }
    }
}
